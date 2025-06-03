import { Skeleton_ChildList } from '@/app/skeletons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ensureMinTime } from '@/utils/loading-utils';
import { decodeHtml } from '@/utils/string-utils';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Image, ListRenderItem, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TabChildListProps<T> {
    tabId: number;
    networkApi: (page: number, tabId: number) => Promise<{ datas: T[] }>;
    /** 容器样式 */
    style?: ViewStyle;
    /** 顶部边距，用于处理顶部导航栏等 */
    marginTop?: number;
    /** 底部边距，用于处理底部TabBar等 */
    marginBottom?: number;
}

// 缓存数据结构
interface CacheData<T> {
    items: T[];
    page: number;
    hasMoreData: boolean;
}

export function TabChildList<T extends { id: number; title: string; link: string; envelopePic?: string; author: string; niceDate: string }>({ 
    tabId, 
    networkApi,
    style,
    marginTop = 0,
    marginBottom = 0
}: TabChildListProps<T>) {
    const insets = useSafeAreaInsets();
    const colors = Colors[useColorScheme() ?? 'light'];
    
    const [items, setItems] = useState<T[]>([]);
    const [page, setPage] = useState<number>(0);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 使用 useRef 存储缓存数据
    const cacheRef = useRef<Map<number, CacheData<T>>>(new Map());
    const isMountedRef = useRef(true);

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const fetchData = useCallback(async (pageNum: number, isRefreshing: boolean = false) => {
        if (!isMountedRef.current) return;

        try {
            setError(null);
            const pageData = await networkApi(pageNum, tabId);
            
            if (pageData?.datas) {
                const newItems = isRefreshing ? pageData.datas : [...items, ...pageData.datas];
                setItems(newItems);
                setHasMoreData(pageData.datas.length > 0);

                // 更新缓存
                cacheRef.current.set(tabId, {
                    items: newItems,
                    page: pageNum,
                    hasMoreData: pageData.datas.length > 0
                });
            }
        } catch (err) {
            setError('加载失败，请重试');
            console.error('Failed to fetch data:', err);
        } finally {
            if (isRefreshing) {
                setRefreshing(false);
            }
        }
    }, [networkApi, tabId, items]);

    // 初始加载数据
    useEffect(() => {
        const loadInitialData = async () => {
            // 检查缓存
            const cachedData = cacheRef.current.get(tabId);
            if (cachedData) {
                setItems(cachedData.items);
                setPage(cachedData.page);
                setHasMoreData(cachedData.hasMoreData);
                return;
            }

            setLoading(true);
            try {
                await fetchData(0);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, [tabId, fetchData]);

    const handleRefresh = useCallback(async () => {
        const startTime = Date.now();
        setPage(0);
        setRefreshing(true);
        setLoading(true);
        try {
            await fetchData(0, true);
            await ensureMinTime(startTime);
        } catch (err) {
            console.error('刷新失败:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [fetchData]);

    const handleLoadMore = useCallback(() => {
        if (hasMoreData && !loading && !refreshing) {
            fetchData(page + 1);
        }
    }, [hasMoreData, loading, refreshing, page, fetchData]);

    const _renderItem = useCallback<ListRenderItem<T>>(({ item }) => {
        const title = decodeHtml(item.title);
        const hasIcon = item.envelopePic && item.envelopePic !== '';

        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                    router.push({
                        pathname: '/public/webView',
                        params: { title: title, url: item.link }
                    });
                }}>
                <ThemedView style={[styles.itemWrapper]}>
                    <ThemedView style={styles.contentStyle}>
                        {hasIcon && (
                            <Image 
                                style={styles.imageStyle} 
                                resizeMode='contain' 
                                source={{ uri: item.envelopePic }} 
                            />
                        )}
                        <ThemedView style={[styles.rightItemStyle, { marginLeft: hasIcon ? 0 : 15 }]}>
                            <ThemedText type='title' style={styles.titleStyle}>{title}</ThemedText>
                            <ThemedView style={styles.bottomStyle}>
                                <ThemedText style={styles.authorStyle}>{item.author}</ThemedText>
                                <ThemedText style={styles.dateStyle}>{item.niceDate}</ThemedText>
                            </ThemedView>
                        </ThemedView>
                    </ThemedView>
                    <IconSymbol size={14} name='chevron.right' color={colors.text} style={{ marginRight: 15 }} />
                </ThemedView>
            </TouchableOpacity>
        );
    }, [colors.text]);

    const _renderSeparator = useCallback(() => (
        <ThemedView style={{ height: 0.5, backgroundColor: colors.separator, marginLeft: 16 }} />
    ), [colors.separator]);

    const _renderError = useCallback(() => {
        if (!error) return null;
        return (
            <ThemedView style={styles.errorContainer}>
                <ThemedText style={styles.errorText}>{error}</ThemedText>
                <TouchableOpacity 
                    style={styles.retryButton}
                    onPress={() => fetchData(page)}
                >
                    <ThemedText style={styles.retryText}>重试</ThemedText>
                </TouchableOpacity>
            </ThemedView>
        );
    }, [error, fetchData, page]);

    const keyExtractor = useCallback((item: T, index: number) => `${item?.id ?? index}-${index}`, []);

    const listProps = useMemo(() => ({
        keyExtractor,
        style: { flex: 1 },
        data: items,
        renderItem: _renderItem,
        initialNumToRender: 10,
        maxToRenderPerBatch: 10,
        windowSize: 5,
        removeClippedSubviews: true,
        updateCellsBatchingPeriod: 50,
        ItemSeparatorComponent: _renderSeparator,
        onEndReachedThreshold: 0.5,
        refreshing: refreshing,
        onRefresh: handleRefresh,
        onEndReached: handleLoadMore,
        ListEmptyComponent: _renderError,
    }), [items, refreshing, loading, error, _renderItem, _renderSeparator, _renderError, keyExtractor, handleRefresh, handleLoadMore]);

    const containerStyle = useMemo(() => {
        const baseStyle: ViewStyle = {
            flex: 1,
            marginTop,
            marginBottom,
        };
        return [baseStyle, style];
    }, [marginTop, marginBottom, style]);

    if (loading && !refreshing) {
        return (
            <ThemedView style={containerStyle}>
                <ThemedView style={{ flex: 1 }}>
                    <Skeleton_ChildList />
                </ThemedView>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={containerStyle}>
            <FlatList {...listProps} />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    itemWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 80,
    },
    contentStyle: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightItemStyle: {
        flex: 1,
        justifyContent: 'space-between',
    },
    titleStyle: {
        fontSize: 15,
        marginBottom: 8,
    },
    bottomStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    authorStyle: {
        fontSize: 12,
        color: '#666',
        marginRight: 8,
    },
    dateStyle: {
        fontSize: 12,
        color: '#999',
    },
    imageStyle: {
        width: 60,
        minHeight: 80,
        margin: 10,
        backgroundColor: '#fff',
    },
    footer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        marginBottom: 10,
    },
    retryButton: {
        padding: 10,
        backgroundColor: '#007AFF',
        borderRadius: 5,
    },
    retryText: {
        color: 'white',
        fontSize: 14,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
}); 