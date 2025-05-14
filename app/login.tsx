import { useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function Login() {
  const router = useRouter();

  const handleLogin = () => {
    router.replace('/(logged-in)/(tabs)');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>欢迎登录</Text>
        <View style={styles.form}>
          {/* 这里可以添加用户名和密码输入框 */}
          <Button
            title="登录"
            onPress={handleLogin}
          />
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
});
