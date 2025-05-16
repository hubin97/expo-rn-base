// app/webview.tsx
import WebViewScreen from '@/components/ThemedWebView';
import { useLocalSearchParams } from 'expo-router';

export default function WebViewPage() {
  const { title, url } = useLocalSearchParams();

  return <WebViewScreen title={`${title || '网页' }`} url={url as string} />;
}
