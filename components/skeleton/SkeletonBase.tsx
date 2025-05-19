import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import ContentLoader from 'react-content-loader/native';
import { Dimensions, SafeAreaView, View } from 'react-native';

const { width: kW, height: kH } = Dimensions.get('window');

// 扩展 Number 类型以支持迭代
declare global {
  interface Number {
    [Symbol.iterator](): Iterator<number>;
  }
}

Number.prototype[Symbol.iterator] = function* () {
  let i = 0;
  let num = this.valueOf();
  while (i < num) {
    yield i++;
  }
};

interface SkeletonBaseProps {
  children: React.ReactNode;
}

export const SkeletonBase: React.FC<SkeletonBaseProps> = ({ children }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ContentLoader
          height={kH}
          width={kW}
          speed={2}
          backgroundColor={colorScheme === 'dark' ? '#2A2A2A' : '#f0f0f0'}
          foregroundColor={colorScheme === 'dark' ? '#3A3A3A' : '#999999'}>
          {children}
        </ContentLoader>
      </View>
    </SafeAreaView>
  );
}; 