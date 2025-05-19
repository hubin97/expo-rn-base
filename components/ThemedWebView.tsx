import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useNavigation } from "expo-router/build/useNavigation";
import React, { useLayoutEffect, useState } from "react";
import { Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { ThemedView } from "./ThemedView";
const { width: kW, height: kH } = Dimensions.get('window');

type Props = {
    title: string,
    url: string
};
  
export default function WebViewScreen({ title, url }: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const insets = useSafeAreaInsets();
  const [progress, setProgress] = useState(0);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
        title: title,
        headerShown: true,
        headerStyle: {
            backgroundColor: colors.background,
        },
        headerBackVisible: false,
        headerBackTitleVisible: false,
        headerTintColor: colors.text,
        headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
            textColor: colors.text,
        },
        headerLeft: () => (
            <Ionicons 
              name="chevron-back" 
              size={24} 
              color={ colors.text }
              style={{ marginLeft: 0 }}
              onPress={() => router.back()}
            />
        ),
    });
  }, [navigation, title, colorScheme, colors]);

  const _renderProgressView = (
    progress < 1 && (
      <ThemedView style={{ position: 'absolute', zIndex: 1000, width: kW, height: 2, backgroundColor: '#fff'}}>
        <ThemedView style={{ width: kW * progress, height: 2, backgroundColor: 'blue' }} />
      </ThemedView>
    )
  );

  return (
    <ThemedView style={{ flex: 1, backgroundColor: colors.background }}>
      { _renderProgressView }
      <WebView style={{ flex: 1 }} source={{ uri: url }} onLoadProgress={(e) => {
        //console.log('>>>', e.nativeEvent.progress);
        const progress = e.nativeEvent.progress;
        setProgress(progress)
      }} />
    </ThemedView>
  );
}