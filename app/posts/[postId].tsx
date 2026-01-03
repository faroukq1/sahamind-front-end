import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { usePost } from "@/hooks/usePost";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner-native";

const PostDetailScreen = () => {
  const router = useRouter();
  const { postId, post: postDataString } = useLocalSearchParams();
  const { user } = useAuthStore();

  // Parse the post data from params
  const postData = postDataString ? JSON.parse(postDataString as string) : null;

  const [commentText, setCommentText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [postLiked, setPostLiked] = useState(false);
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());
  const [localLikeCount, setLocalLikeCount] = useState(
    postData?.like_count || 0
  );
  const [showMenu, setShowMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");

  const {
    responses,
    responsesLoading,
    createResponse,
    createResponseLoading,
    deleteResponse,
    togglePostLike,
    toggleResponseLike,
    refetchResponses,
    deletePost,
    deletePostLoading,
    reportPost,
    reportPostLoading,
  } = usePost(postId as string);

  const handleBack = () => {
    router.back();
  };

  const handleDeletePost = () => {
    if (!user || Number(user.id) !== postData.author_id) {
      toast.error("You can only delete your own posts");
      return;
    }

    setShowMenu(false);

    deletePost(
      { postId: Number(postId), userId: Number(user.id) },
      {
        onSuccess: () => {
          toast.success("Post deleted successfully");
          router.back();
        },
        onError: () => {
          toast.error("Failed to delete post");
        },
      }
    );
  };

  const handleReportPost = () => {
    if (!user) {
      toast.error("Please login to report posts");
      return;
    }

    setShowMenu(false);
    setShowReportModal(true);
  };

  const handleSubmitReport = () => {
    if (!reportReason.trim()) {
      toast.error("Please enter a reason for reporting");
      return;
    }

    reportPost(
      { postId: Number(postId), reason: reportReason.trim() },
      {
        onSuccess: () => {
          toast.success("Post reported successfully");
          setShowReportModal(false);
          setReportReason("");
        },
        onError: () => {
          toast.error("Failed to report post");
        },
      }
    );
  };

  const handleLikePost = () => {
    if (!user) {
      toast.error("Please login to like posts");
      return;
    }
    setPostLiked(!postLiked);
    setLocalLikeCount(postLiked ? localLikeCount - 1 : localLikeCount + 1);
    togglePostLike({ postId: Number(postId), userId: Number(user.id) });
  };

  const handleAddComment = () => {
    if (!user) {
      toast.error("Please login to comment");
      return;
    }

    if (!commentText.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    createResponse(
      {
        post_id: Number(postId),
        user_id: Number(user.id),
        content: commentText,
        is_anonymous: isAnonymous,
      },
      {
        onSuccess: () => {
          setCommentText("");
          setIsAnonymous(false);
          refetchResponses();
          toast.success("Comment added successfully");
        },
        onError: () => {
          toast.error("Failed to add comment");
        },
      }
    );
  };

  const handleDeleteComment = (responseId: number, authorId: number) => {
    if (!user || Number(user.id) !== authorId) {
      toast.error("You can only delete your own comments");
      return;
    }

    // Note: sonner-native doesn't have built-in confirmation dialogs
    // For now, directly delete. Consider adding a confirmation modal if needed.
    deleteResponse(
      { responseId, userId: Number(user.id) },
      {
        onSuccess: () => {
          toast.success("Comment deleted");
        },
        onError: () => {
          toast.error("Failed to delete comment");
        },
      }
    );
  };

  const handleLikeComment = (responseId: number) => {
    if (!user) {
      toast.error("Please login to like comments");
      return;
    }
    setLikedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(responseId)) {
        newSet.delete(responseId);
      } else {
        newSet.add(responseId);
      }
      return newSet;
    });
    toggleResponseLike({ responseId, userId: Number(user.id) });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchResponses();
    setRefreshing(false);
  };

  if (!postData) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-600">Post not found</Text>
      </SafeAreaView>
    );
  }

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
                <Ionicons name="chevron-back" size={24} color="#2563eb" />
              </TouchableOpacity>
              <Text className="text-xl font-bold text-gray-800">Post</Text>
            </View>

            {/* Three-dot menu */}
            <View>
              <TouchableOpacity
                onPress={() => setShowMenu(!showMenu)}
                className="w-10 h-10 items-center justify-center"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name="ellipsis-horizontal"
                  size={24}
                  color="#6b7280"
                />
              </TouchableOpacity>

              {/* Dropdown Menu */}
              {showMenu && (
                <View className="absolute right-0 top-12 bg-white rounded-lg shadow-lg border border-gray-200 w-48 z-50">
                  {user && Number(user.id) === postData.author_id && (
                    <TouchableOpacity
                      onPress={handleDeletePost}
                      className="flex-row items-center px-4 py-3 border-b border-gray-100"
                      disabled={deletePostLoading}
                    >
                      {deletePostLoading ? (
                        <ActivityIndicator size="small" color="#ef4444" />
                      ) : (
                        <Ionicons
                          name="trash-outline"
                          size={20}
                          color="#ef4444"
                        />
                      )}
                      <Text className="text-red-600 ml-3 font-medium">
                        Delete Post
                      </Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    onPress={handleReportPost}
                    className="flex-row items-center px-4 py-3"
                    disabled={reportPostLoading}
                  >
                    {reportPostLoading ? (
                      <ActivityIndicator size="small" color="#f59e0b" />
                    ) : (
                      <Ionicons name="flag-outline" size={20} color="#f59e0b" />
                    )}
                    <Text className="text-gray-800 ml-3 font-medium">
                      Report Post
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onScroll={() => showMenu && setShowMenu(false)}
          scrollEventThrottle={16}
        >
          {/* Post Content */}
          <View className="bg-white p-4 mb-2">
            {/* Author Info */}
            <View className="flex-row items-center mb-3">
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="person" size={20} color="#2563eb" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-800">
                  {postData.is_anonymous ? "Anonymous" : postData.author_name}
                </Text>
              </View>
              <Text className="text-xs text-gray-400">
                {new Date(postData.created_at).toLocaleDateString()}
              </Text>
            </View>

            {/* Post Title */}
            <Text className="text-2xl font-bold text-gray-800 mb-3">
              {postData.title}
            </Text>

            {/* Post Content */}
            <Text className="text-base text-gray-700 leading-6 mb-4">
              {postData.content}
            </Text>

            {/* Post Actions */}
            <View className="flex-row items-center pt-3 border-t border-gray-100">
              <TouchableOpacity
                className="flex-row items-center mr-6"
                onPress={handleLikePost}
              >
                <Ionicons
                  name={postLiked ? "heart" : "heart-outline"}
                  size={22}
                  color="#ef4444"
                />
                <Text className="text-sm text-gray-700 ml-2 font-medium">
                  {localLikeCount}
                </Text>
              </TouchableOpacity>

              <View className="flex-row items-center">
                <Ionicons name="chatbubble-outline" size={20} color="#2563eb" />
                <Text className="text-sm text-gray-700 ml-2 font-medium">
                  {responses?.length || 0}
                </Text>
              </View>
            </View>
          </View>

          {/* Comments Section */}
          <View className="bg-gray-50 px-4 pt-5 pb-2">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              Comments ({responses?.length || 0})
            </Text>

            {responsesLoading ? (
              <View className="py-8">
                <ActivityIndicator size="large" color="#2563eb" />
              </View>
            ) : responses && responses.length > 0 ? (
              <View>
                {responses.map((response, index) => (
                  <View key={response.id} className="mb-3">
                    <View className="flex-row">
                      {/* Avatar */}
                      <View className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center mr-3">
                        <Text className="text-white font-bold text-sm">
                          {response.is_anonymous
                            ? "A"
                            : response.author_name?.charAt(0)?.toUpperCase() ||
                              "?"}
                        </Text>
                      </View>

                      {/* Comment Content */}
                      <View className="flex-1">
                        {/* Author Name Above Bubble */}
                        <Text className="text-xs font-semibold text-gray-700 mb-1 ml-1">
                          {response.is_anonymous
                            ? "Anonymous"
                            : response.author_name || "User"}
                        </Text>

                        {/* Comment Bubble */}
                        <View className="bg-gray-200 rounded-2xl px-4 py-3">
                          {/* Comment Text */}
                          <Text className="text-sm text-gray-800 leading-5">
                            {response.content}
                          </Text>
                        </View>

                        {/* Actions Row - Facebook Style */}
                        <View className="flex-row items-center ml-4 mt-1">
                          <TouchableOpacity
                            className="flex-row items-center mr-4"
                            onPress={() => handleLikeComment(response.id)}
                          >
                            <Ionicons
                              name={
                                likedComments.has(response.id)
                                  ? "heart"
                                  : "heart-outline"
                              }
                              size={16}
                              color={
                                likedComments.has(response.id)
                                  ? "#ef4444"
                                  : "#6b7280"
                              }
                            />
                            {response.like_count +
                              (likedComments.has(response.id) ? 1 : 0) >
                              0 && (
                              <Text className="text-xs text-gray-600 ml-1 font-medium">
                                {response.like_count +
                                  (likedComments.has(response.id) ? 1 : 0)}
                              </Text>
                            )}
                          </TouchableOpacity>

                          {user && Number(user.id) === response.author_id && (
                            <TouchableOpacity
                              className="flex-row items-center mr-4"
                              onPress={() =>
                                handleDeleteComment(
                                  response.id,
                                  response.author_id
                                )
                              }
                            >
                              <Ionicons
                                name="trash-outline"
                                size={14}
                                color="#6b7280"
                              />
                              <Text className="text-xs text-gray-600 ml-1 font-medium">
                                Delete
                              </Text>
                            </TouchableOpacity>
                          )}

                          <Text className="text-xs text-gray-500">
                            {new Date(response.created_at).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View className="py-12 items-center">
                <Ionicons
                  name="chatbubbles-outline"
                  size={48}
                  color="#d1d5db"
                />
                <Text className="text-gray-500 mt-3 font-semibold">
                  No comments yet
                </Text>
                <Text className="text-gray-400 text-sm mt-1">
                  Be the first to share your thoughts
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Comment Input */}
        <View className="bg-white border-t border-gray-200 p-4">
          {/* Display Name */}
          <View className="mb-2">
            <Text className="text-sm font-semibold text-gray-800">
              {isAnonymous ? "Anonymous" : user?.email?.split("@")[0] || "User"}
            </Text>
          </View>

          <View className="flex-row items-center mb-2">
            <TouchableOpacity
              onPress={() => setIsAnonymous(!isAnonymous)}
              className={`flex-row items-center px-3 py-2 rounded-full mr-2 ${
                isAnonymous ? "bg-blue-100" : "bg-gray-100"
              }`}
            >
              <Ionicons
                name={isAnonymous ? "eye-off" : "eye"}
                size={16}
                color={isAnonymous ? "#2563eb" : "#6b7280"}
              />
              <Text
                className={`text-xs ml-1.5 font-medium ${
                  isAnonymous ? "text-blue-600" : "text-gray-600"
                }`}
              >
                {isAnonymous ? "Post anonymously" : "Post as yourself"}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row items-end">
            <View className="flex-1 mr-2">
              <TextInput
                className="bg-gray-100 rounded-2xl px-4 py-3 max-h-24"
                placeholder="Write a comment..."
                value={commentText}
                onChangeText={setCommentText}
                multiline
                maxLength={500}
                style={{ textAlignVertical: "top" }}
              />
            </View>
            <TouchableOpacity
              onPress={handleAddComment}
              disabled={createResponseLoading || !commentText.trim()}
              className={`w-12 h-12 rounded-full items-center justify-center ${
                commentText.trim() ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              {createResponseLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="send" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Report Modal */}
      <Modal
        visible={showReportModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowReportModal(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center px-4">
          <View className="bg-white rounded-2xl w-full max-w-md p-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-gray-800">
                Report Post
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowReportModal(false);
                  setReportReason("");
                }}
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <Text className="text-sm text-gray-600 mb-4">
              Please describe why you're reporting this post. This helps our
              moderators take appropriate action.
            </Text>

            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-4 min-h-[120px]"
              placeholder="Describe the issue..."
              value={reportReason}
              onChangeText={setReportReason}
              multiline
              maxLength={500}
              textAlignVertical="top"
              placeholderTextColor="#9ca3af"
            />

            <Text className="text-xs text-gray-500 mb-4 text-right">
              {reportReason.length}/500
            </Text>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => {
                  setShowReportModal(false);
                  setReportReason("");
                }}
                className="flex-1 bg-gray-200 py-3 rounded-lg items-center"
              >
                <Text className="text-gray-800 font-semibold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSubmitReport}
                disabled={reportPostLoading || !reportReason.trim()}
                className={`flex-1 py-3 rounded-lg items-center ${
                  reportPostLoading || !reportReason.trim()
                    ? "bg-gray-300"
                    : "bg-red-600"
                }`}
              >
                {reportPostLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="text-white font-semibold">
                    Submit Report
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default PostDetailScreen;
