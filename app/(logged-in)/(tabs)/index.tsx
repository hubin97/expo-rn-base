import { homeApi } from '@/app/api/network';
import { Article, Banner } from '@/app/api/types';
import { Skeleton_Home } from '@/app/skeletons';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ensureMinTime } from '@/utils/loading-utils';
import { decodeHtml } from '@/utils/string-utils';
import { Carousel } from "@ant-design/react-native";
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Image, ListRenderItem, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [naviOpacity, setNaviOpacity] = useState(0);

  const pageSize: number = 20;

  // 获取文章列表数据
  const fetchArticleList = async (pageNum: number) => {
    try {
      const result = await homeApi.getArticleList(pageNum, pageSize);
      if (pageNum === 0) {
        setArticles(result.datas);
      } else {
        let total = result.total;
        if (pageNum * pageSize <= total) {
          let datas = [...articles, ...result.datas];
          setHasMoreData(true);
          setArticles(datas);
        } else {
          setHasMoreData(false);
        }
      }
      return result;
    } catch (err) {
      console.error('文章列表失败:', err instanceof Error ? err.message : err);
      throw err;
    }
  };

  // 加载首页数据
  const loadHomeData = async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const startTime = Date.now();
      const [bannerResult, articleResult] = await Promise.all([
        homeApi.getBanner(),
        homeApi.getArticleList(0, pageSize)
      ]);
      setBanners(bannerResult);
      setArticles(articleResult.datas);
      await ensureMinTime(startTime);
    } catch (err) {
      console.error('加载失败:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadHomeData();
  }, []);

  // 下拉刷新
  const handleRefresh = () => {
    setPage(0);
    loadHomeData();
  };

  // 上拉加载更多
  useEffect(() => {
    if (page === 0) { return; }
    
    const fetchData = async () => {
      try {
        setRefreshing(true);
        await fetchArticleList(page);
      } catch (err) {
        console.error('加载失败:', err);
      } finally {
        setRefreshing(false);
      }
    };
    
    fetchData();
  }, [page]);

  const _renderCarousel = (
    <Carousel autoplay infinite style={styles.carousel} >
      { 
      banners.length > 0 && banners.map(item => {
        return (
          <TouchableOpacity key={item.id} activeOpacity={0.7} onPress={() => {
            // console.log('item>>>', JSON.stringify(item));
            router.push({
              pathname: '/public/webView',
              params: { title: decodeHtml(item.title), url: item.url }
            });
          }}>
            <Image style={{width: '100%', height: '100%'}} source={{uri: item.imagePath ?? ''}}/>
          </TouchableOpacity>
        );
      }) 
      }
    </Carousel>
  )

  const _renderItem: ListRenderItem<Article>  = ({ item }) => {
    return (
      <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        //console.log('item>>>', JSON.stringify(item));
        router.push({
          pathname: '/public/webView',
          params: { title: decodeHtml(item.title), url: item.link }
        });
      }}>
      <ThemedView style={[styles.itemWrapper ]}>
        <IconSymbol size={14} name='chevron.right' color={ Colors[colorScheme ?? 'light'].text } style={{ marginRight: 15 }}/>
        <ThemedView style={styles.contentStyle}>
          <ThemedText type='title' style={{ fontSize: 15 }}>{ decodeHtml(item.title) }</ThemedText>
          <ThemedView
            style={styles.bottomStyle}>
            <ThemedText type='default' style={{ fontSize: 12 }}>更新时间: {item.niceDate}</ThemedText>
            <ThemedText type='default' style={{ fontSize: 12 }}>{ item.author && `作者: ${item.author}` }</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
    );
  };

  const _renderSeparator = () => (
    <ThemedView style={{ height: 0.5, backgroundColor: Colors[colorScheme ?? 'light'].separator, marginLeft: 16 }} />
  );

  const _onScroll = (e: any) => {
    let originY = e.nativeEvent.contentOffset.y;
    // console.log('originY>>', originY);
    if (originY <= 0) {
      naviOpacity && setNaviOpacity(0)
    } else if (originY <= 44) {
      setNaviOpacity(originY/44)
    } else if (originY > 44) {
      naviOpacity < 1 && setNaviOpacity(1)
    } 
  }

  if (loading) {
    return <Skeleton_Home />;
  }

  return (
    <ThemedView style={styles.container}> 
      <ThemedView style={[ styles.naviWrapper, { height: insets.top + 44, borderBottomColor: Colors[colorScheme ?? 'light'].separator, opacity: naviOpacity }]}>
        <ThemedView style={[ styles.naviItem, { marginTop: insets.top } ]}>
            <ThemedText type='title' style={{ fontSize: 18 }} >{'首页'}</ThemedText>
        </ThemedView>
      </ThemedView>
      <FlatList
        keyExtractor={(item: Article, index: number) => `${item.id}-${index}`}
        style={[styles.flatlist, { marginTop: insets.top }]}
        data={articles}
        renderItem={_renderItem}
        initialNumToRender={10}
        ListHeaderComponent={_renderCarousel}
        ItemSeparatorComponent={_renderSeparator}
        onScroll={_onScroll}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={() => {
          if (hasMoreData) {
            setPage(page + 1);
          }
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  naviWrapper: {
    position: 'absolute', 
    zIndex: 1000, 
    width: '100%',  
    borderBottomWidth: 0.5
  },
  naviItem: {
    justifyContent: 'center', 
    alignItems: 'center',
  },
  carousel: {
    width: '100%',
    height: 200,
  },
  flatlist: {
    flex: 1, 
  },
  itemWrapper: {
    flexDirection: 'row-reverse', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    //borderBottomWidth: 0.5, 
    minHeight: 60, 
  },
  nextStyle: {
    width: 15, 
    height: 15, 
    marginRight: 15, 
    opacity: 0.5
  },
  contentStyle: {
    flex: 1, 
    padding: 10, 
  },
  bottomStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
});
