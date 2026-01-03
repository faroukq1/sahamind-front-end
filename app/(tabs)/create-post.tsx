import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import { useForum } from "@/hooks/useForum";
import { toast } from "sonner-native";

const CreatePostScreen = () => {
  const router = useRouter();
  const { forumId, forumName } = useLocalSearchParams();
  const { user } = useAuthStore();
  const { createPost, createPostLoading } = useForum();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!content.trim()) {
      toast.error("Please enter content");
      return;
    }

    if (!user) {
      toast.error("Please login to create a post");
      return;
    }

    createPost(
      {
        forum_id: Number(forumId),
        user_id: Number(user.id),
        title: title.trim(),
        content: content.trim(),
        is_anonymous: isAnonymous,
      },
      {
        onSuccess: () => {
          toast.success("Post created successfully");
          router.back();
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to create post");
        },
      }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <View className="bg-white px-4 py-3 border-b border-gray-200">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={handleBack}
                className="mr-3"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color="#2563eb" />
              </TouchableOpacity>
              <Text className="text-xl font-bold text-gray-800">
                Create Post
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={createPostLoading || !title.trim() || !content.trim()}
              className={`px-4 py-2 rounded-full ${
                createPostLoading || !title.trim() || !content.trim()
                  ? "bg-gray-300"
                  : "bg-blue-600"
              }`}
            >
              {createPostLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-white font-semibold">Post</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1">
          <View className="p-4">
            {/* Forum Info */}
            <View className="bg-blue-50 p-3 rounded-lg mb-4 flex-row items-center">
              <Ionicons name="chatbubbles" size={20} color="#2563eb" />
              <Text className="text-blue-600 font-medium ml-2">
                {forumName || "Forum"}
              </Text>
            </View>

            {/* Anonymous Toggle */}
            <TouchableOpacity
              onPress={() => setIsAnonymous(!isAnonymous)}
              className={`flex-row items-center px-4 py-3 rounded-lg mb-4 ${
                isAnonymous ? "bg-blue-100" : "bg-gray-100"
              }`}
            >
              <Ionicons
                name={isAnonymous ? "eye-off" : "eye"}
                size={20}
                color={isAnonymous ? "#2563eb" : "#6b7280"}
              />
              <Text
                className={`ml-2 font-medium ${
                  isAnonymous ? "text-blue-600" : "text-gray-600"
                }`}
              >
                {isAnonymous ? "Posting anonymously" : "Post as yourself"}
              </Text>
            </TouchableOpacity>

            {/* Display Name */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Posting as:{" "}
                <Text className="text-gray-900">
                  {isAnonymous
                    ? "Anonymous"
                    : user?.email?.split("@")[0] || "User"}
                </Text>
              </Text>
            </View>

            {/* Title Input */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Title
              </Text>
              <TextInput
                className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-base"
                placeholder="What's on your mind?"
                value={title}
                onChangeText={setTitle}
                maxLength={200}
                placeholderTextColor="#9ca3af"
              />
              <Text className="text-xs text-gray-500 mt-1 text-right">
                {title.length}/200
              </Text>
            </View>

            {/* Content Input */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Content
              </Text>
              <TextInput
                className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-base min-h-[200px]"
                placeholder="Share your thoughts..."
                value={content}
                onChangeText={setContent}
                multiline
                maxLength={2000}
                textAlignVertical="top"
                placeholderTextColor="#9ca3af"
              />
              <Text className="text-xs text-gray-500 mt-1 text-right">
                {content.length}/2000
              </Text>
            </View>

            {/* Guidelines */}
            <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <View className="flex-row items-start">
                <Ionicons name="information-circle" size={20} color="#f59e0b" />
                <View className="flex-1 ml-2">
                  <Text className="text-sm font-semibold text-yellow-800 mb-1">
                    Community Guidelines
                  </Text>
                  <Text className="text-xs text-yellow-700">
                    • Be respectful and kind to others{"\n"}• No hate speech or
                    harassment{"\n"}• Keep content relevant to mental health
                    {"\n"}• Protect your and others' privacy
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreatePostScreen;
