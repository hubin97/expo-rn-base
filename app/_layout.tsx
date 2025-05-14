import { Redirect, Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <Redirect href="/login" />
    </>
  );
}
