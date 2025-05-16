import type { Article } from '@/app/api/types';
import { useRouter } from 'expo-router';
import { useState } from 'react';
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
    }, 500);
  };
  
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
