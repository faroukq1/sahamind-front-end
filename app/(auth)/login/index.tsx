import { useAuth } from "@/hooks/useAuth";
import { loginSchema } from "@/schemas/authSchema";
import { handleAsync } from "@/utils/handleAsync";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Redirect, useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { toast } from "sonner-native";

export default function LoginScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated, isLoading } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: any) => {
    const { success, error } = await handleAsync(() => login(data));

    if (success) {
      toast.success("Logged in successfully!");
      router.replace("/(tabs)");
    } else {
      toast.error(error);
    }
    router.push("/(tabs)");
  };

  if (isAuthenticated) return <Redirect href="/(tabs)" />;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerClassName="flex-grow">
        <View className="flex-1 px-6 pt-8 pb-8 justify-center">
          {/* Title */}
          <Text className="text-3xl font-bold text-center text-gray-900 mb-2">
            Ready to Begin?
          </Text>
          <Text className="text-center text-gray-500 mb-8">
            Join us or log in to explore the features{"\n"}of our apps
          </Text>

          {/* Tabs */}
          <View className="flex-row mb-6">
            <View className="flex-1 pb-3 border-b-2 border-blue-500">
              <Text className="text-center text-gray-900 font-semibold">
                Log In
              </Text>
            </View>
            <TouchableOpacity
              className="flex-1 pb-3 border-b-2 border-gray-200"
              onPress={() => router.push("/(auth)/register")}
            >
              <Text className="text-center text-gray-500 font-semibold">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {/* Email Input */}
          <View className="mb-4">
            <Text className="text-gray-700 text-sm mb-2">
              Email <Text className="text-red-500">*</Text>
            </Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3.5 text-gray-900"
                  placeholder="Enter your email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              )}
            />
            {errors.email && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </Text>
            )}
          </View>

          {/* Password Input */}
          <View className="mb-6">
            <Text className="text-gray-700 text-sm mb-2">
              Password <Text className="text-red-500">*</Text>
            </Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="relative">
                  <TextInput
                    className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3.5 text-gray-900 pr-12"
                    placeholder="••••••••••••"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                  />
                  <TouchableOpacity
                    className="absolute right-4 top-3.5"
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.password && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </Text>
            )}
          </View>

          {/* Login Button */}
          <TouchableOpacity
            className={`bg-blue-500 rounded-lg py-4 mb-4 ${
              isLoading ? "opacity-50" : ""
            }`}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold text-base">
                Log In
              </Text>
            )}
          </TouchableOpacity>

          {/* Forgot Password Link */}
          <TouchableOpacity className="mb-4">
            <Text className="text-blue-500 text-center text-sm font-medium">
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View className="flex-row justify-center">
            <Text className="text-gray-600 text-sm">
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
              <Text className="text-blue-500 text-sm font-medium">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
