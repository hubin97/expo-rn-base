import { homeApi } from '@/app/api/request';
import type { Article } from '@/app/api/types';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [bannerData, setBannerData] = useState<Article[]>([]);

  const handleLogin = () => {
    setLoading(true);
    // 这里可以添加登录逻辑
    setTimeout(() => {
      setLoading(false);
      router.replace('/(logged-in)/(tabs)');
    }, 1000);
  };
  
  useEffect(() => {
    // 获取轮播图数据
    const fetchBanner = async () => {
      try {
        console.log('开始获取轮播图数据...');
        const result = await homeApi.getBanner();
        console.log('获取轮播图数据成功:', result);
        if (Array.isArray(result)) {
          setBannerData(result);
        } else {
          console.warn('轮播图数据格式不正确:', result);
        }
      } catch (err) {
        console.error('获取轮播图失败:', err instanceof Error ? err.message : err);
      }
    };

    fetchBanner();
  }, []);
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>欢迎登录</Text>
        <View style={styles.form}>
          {/* 这里可以添加用户名和密码输入框 */}
          <Button
            title={loading ? "登录中..." : "登录"}
            onPress={handleLogin}
            disabled={loading}
          />
          {loading && <ActivityIndicator style={styles.loading} />}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  form: {
    width: '100%',
    maxWidth: 300,
    gap: 20,
  },
  loading: {
    marginTop: 10,
  },
});
