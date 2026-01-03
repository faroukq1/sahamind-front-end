import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import FloatingActionButton from "@/components/FloatingActionButton";
import { useForum } from "@/hooks/useForum";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import { toast } from "sonner-native";
import { Forum, ForumPost } from "@/store/forumStore";

const ForumScreen = () => {
  const router = useRouter();
  const [showForumList, setShowForumList] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const {
    selectedForum,
    forums,
    posts,
    forumsLoading,
    postsLoading,
    setSelectedForum,
    refetchForums,
    refetchPosts,
  } = useForum();

  const { user } = useAuthStore();

  const handleSelectForum = (forum: Forum) => {
    setSelectedForum(forum);
    setShowForumList(false);
  };

  const handleBackToForums = () => {
    setShowForumList(true);
    setSelectedForum(null);
  };

  const handleCreatePost = () => {
    if (!selectedForum) {
      toast.error("Please select a forum first");
      return;
    }
    if (!user) {
      toast.error("Please login to create a post");
      return;
    }
    router.push({
      pathname: "/(tabs)/create-post",
      params: {
        forumId: selectedForum.id,
        forumName: selectedForum.name,
      },
    });
  };

  const handlePostPress = (post: ForumPost) => {
    router.push({
      pathname: "/posts/[postId]",
      params: {
        postId: post.id,
        post: JSON.stringify(post),
      },
    });
  };

  const handleLikePost = (postId: number) => {
    // Like action will be handled through the hook
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (showForumList) {
      await refetchForums();
    } else {
      await refetchPosts();
    }
    setRefreshing(false);
  };

  if (forumsLoading && showForumList) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      {showForumList ? (
        // Forums List View
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View className="px-4 py-4">
            {forums && Array.isArray(forums) && forums.length > 0 ? (
              forums.map((forum: Forum) => (
                <TouchableOpacity
                  key={forum.id}
                  onPress={() => handleSelectForum(forum)}
                  className="bg-white rounded-lg p-4 mb-3 shadow-sm"
                  activeOpacity={0.7}
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-gray-800">
                        {forum.name}
                      </Text>
                      <Text className="text-sm text-blue-600 font-medium mt-1">
                        {forum.thematic}
                      </Text>
                    </View>
                    <View className="bg-blue-100 px-3 py-1 rounded-full">
                      <Text className="text-xs font-semibold text-blue-600">
                        {forum.post_count}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-sm text-gray-600 mb-3">
                    {forum.description}
                  </Text>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-xs text-gray-500">
                      {forum.moderator_count} moderators
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color="#9ca3af"
                    />
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View className="items-center justify-center py-12">
                <Ionicons
                  name="chatbubbles-outline"
                  size={48}
                  color="#d1d5db"
                />
                <Text className="text-gray-500 mt-4">No forums available</Text>
              </View>
            )}
          </View>
        </ScrollView>
      ) : (
        // Forum Posts View
        <View className="flex-1">
          {/* Header with back button */}
          <View className="bg-white px-4 py-3 border-b border-gray-200">
            <View className="flex-row items-center mb-2">
              <TouchableOpacity
                onPress={handleBackToForums}
                className="mr-3"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="chevron-back" size={24} color="#2563eb" />
              </TouchableOpacity>
              <View className="flex-1">
                <Text className="text-xl font-bold text-gray-800">
                  {selectedForum?.name}
                </Text>
                <Text className="text-sm text-gray-600">
                  {Array.isArray(posts) ? posts.length : 0} posts
                </Text>
              </View>
            </View>
          </View>

          {/* Posts List */}
          {postsLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#2563eb" />
            </View>
          ) : (
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              contentContainerStyle={{ paddingBottom: 80 }}
            >
              <View className="px-4 py-4">
                {!posts || !Array.isArray(posts) || posts.length === 0 ? (
                  <View className="items-center justify-center py-12">
                    <Ionicons
                      name="chatbubbles-outline"
                      size={48}
                      color="#d1d5db"
                    />
                    <Text className="text-gray-500 mt-4">No posts yet</Text>
                  </View>
                ) : (
                  posts.map((post: ForumPost) => (
                    <TouchableOpacity
                      key={post.id}
                      onPress={() => handlePostPress(post)}
                      className="bg-white rounded-lg p-4 mb-3 shadow-sm"
                      activeOpacity={0.7}
                    >
                      <View className="flex-row justify-between items-start mb-2">
                        <View className="flex-1">
                          <View className="flex-row items-center mb-1">
                            <Text className="text-sm font-medium text-gray-600">
                              {post.is_anonymous
                                ? "Anonymous"
                                : post.author_name}
                            </Text>
                          </View>
                          <Text className="text-lg font-semibold text-gray-800">
                            {post.title}
                          </Text>
                        </View>
                      </View>

                      <Text
                        className="text-sm text-gray-600 mb-3"
                        numberOfLines={2}
                      >
                        {post.content}
                      </Text>

                      {/* Stats and Actions */}
                      <View className="flex-row justify-between items-center pt-3 border-t border-gray-100">
                        <View className="flex-row gap-4">
                          <TouchableOpacity
                            className="flex-row items-center gap-1"
                            onPress={() => handleLikePost(post.id)}
                          >
                            <Ionicons
                              name="heart-outline"
                              size={16}
                              color="#ef4444"
                            />
                            <Text className="text-xs text-gray-600">
                              {post.like_count}
                            </Text>
                          </TouchableOpacity>

                          <View className="flex-row items-center gap-1">
                            <Ionicons
                              name="chatbubble-outline"
                              size={16}
                              color="#2563eb"
                            />
                            <Text className="text-xs text-gray-600">
                              {post.response_count}
                            </Text>
                          </View>
                        </View>

                        <Text className="text-xs text-gray-400">
                          {new Date(post.created_at).toLocaleDateString()}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </ScrollView>
          )}

          {/* Floating Action Button */}
          <FloatingActionButton onPress={handleCreatePost} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default ForumScreen;
