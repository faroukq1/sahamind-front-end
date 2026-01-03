import { AVAILABLE_EMOTIONS } from "@/constants/data";
import { useAuth } from "@/hooks/useAuth";
import { registerSchema } from "@/schemas/authSchema";
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

export default function RegisterScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const { register, isAuthenticated, isLoading } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      emotions_kw: [],
    },
  });

  const toggleEmotion = (emotion: string) => {
    let updatedEmotions;
    if (selectedEmotions.includes(emotion)) {
      updatedEmotions = selectedEmotions.filter((e) => e !== emotion);
    } else {
      updatedEmotions = [...selectedEmotions, emotion];
    }
    setSelectedEmotions(updatedEmotions);
    setValue("emotions_kw", updatedEmotions);
  };

  const onSubmit = async (data: any) => {
    const { success, error } = await handleAsync(() =>
      register({
        email: data.email,
        password: data.password,
        emotions_kw: selectedEmotions,
      })
    );
    if (success) {
      toast.success("Account created successfully!");
      router.replace("/(tabs)");
    } else {
      toast.error(error);
    }
  };

  if (isAuthenticated) return <Redirect href="/(tabs)" />;

  return (
    <SafeAreaView className="mt-10 flex-1 bg-white">
      <ScrollView>
        <View className="flex-1 px-6 pt-8 pb-8">
          {/* Title */}
          <Text className="text-3xl font-bold text-center text-gray-900 mb-2">
            Ready to Begin?
          </Text>
          <Text className="text-center text-gray-500 mb-8">
            Join us or log in to explore the features{"\n"}of our apps
          </Text>

          {/* Tabs */}
          <View className="flex-row mb-6">
            <TouchableOpacity
              className="flex-1 pb-3 border-b-2 border-gray-200"
              onPress={() => router.push("/login")}
            >
              <Text className="text-center text-gray-500 font-semibold">
                Log In
              </Text>
            </TouchableOpacity>
            <View className="flex-1 pb-3 border-b-2 border-blue-500">
              <Text className="text-center text-gray-900 font-semibold">
                Sign Up
              </Text>
            </View>
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
          <View className="mb-4">
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

          {/* Confirm Password Input */}
          <View className="mb-4">
            <Text className="text-gray-700 text-sm mb-2">
              Confirm Password <Text className="text-red-500">*</Text>
            </Text>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="relative">
                  <TextInput
                    className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3.5 text-gray-900 pr-12"
                    placeholder="••••••••••••"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={!showConfirmPassword}
                    autoComplete="password"
                  />
                  <TouchableOpacity
                    className="absolute right-4 top-3.5"
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Ionicons
                      name={
                        showConfirmPassword ? "eye-off-outline" : "eye-outline"
                      }
                      size={20}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.confirmPassword && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </Text>
            )}
          </View>

          {/* Emotions Selection */}
          <View className="mb-6">
            <Text className="text-gray-700 text-sm mb-3">
              Select Your Emotions (Optional)
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {AVAILABLE_EMOTIONS.map((emotion) => (
                <TouchableOpacity
                  key={emotion}
                  onPress={() => toggleEmotion(emotion)}
                  className={`px-4 py-2 rounded-lg border ${
                    selectedEmotions.includes(emotion)
                      ? "bg-blue-500 border-blue-500"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      selectedEmotions.includes(emotion)
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {emotion}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {selectedEmotions.length > 0 && (
              <Text className="text-xs text-gray-500 mt-2">
                Selected: {selectedEmotions.join(", ")}
              </Text>
            )}
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            className={`bg-blue-500 rounded-lg py-4 ${
              isLoading ? "opacity-50" : ""
            }`}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold text-base">
                Sign Up
              </Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View className="flex-row justify-center mt-4">
            <Text className="text-gray-600 text-sm">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text className="text-blue-500 text-sm font-medium">Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
