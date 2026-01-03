import { queryClient } from "@/utils/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster } from "sonner-native";
import "../global.css";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "white" },
          }}
        >
          <Stack.Screen name="(auth)/login/index" />
          <Stack.Screen name="(auth)/register/index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="posts/[postId]" />
          <Stack.Screen name="chat" />
        </Stack>
        <View className="mb-4">
          <Toaster position="bottom-center" />
        </View>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
