import { customFetch } from "@/utils/customFetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface PostResponse {
  id: number;
  post_id: number;
  author_id: number;
  author_name: string;
  content: string;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
  like_count: number;
}

export interface PostDetail {
  id: number;
  forum_id: number;
  author_id: number;
  author_name: string;
  title: string;
  content: string;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
  like_count: number;
  response_count: number;
}

export const usePost = (postId: string | number) => {
  const queryClient = useQueryClient();

  // Fetch single post details (we'll construct this from forum posts or create endpoint)
  const {
    data: post,
    isLoading: postLoading,
    error: postError,
    refetch: refetchPost,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      // Since there's no single post endpoint, we need to get it from a forum
      // For now, we'll use the post data passed through navigation
      // Or you could fetch all posts and find the one you need
      return null as PostDetail | null;
    },
    enabled: !!postId,
  });

  // Fetch responses/comments for the post
  const {
    data: responses,
    isLoading: responsesLoading,
    error: responsesError,
    refetch: refetchResponses,
  } = useQuery({
    queryKey: ["post-responses", postId],
    queryFn: async () => {
      const { data } = await customFetch.get(
        `/forums/posts/${postId}/responses`
      );
      return data as PostResponse[];
    },
    enabled: !!postId,
  });

  // Create response/comment mutation
  const createResponseMutation = useMutation({
    mutationFn: async (responseData: {
      post_id: number;
      user_id: number;
      content: string;
      is_anonymous: boolean;
    }) => {
      const { data } = await customFetch.post(
        "/forums/responses",
        responseData
      );
      return data as PostResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-responses", postId] });
      queryClient.invalidateQueries({ queryKey: ["forum-posts"] });
    },
  });

  // Delete response mutation
  const deleteResponseMutation = useMutation({
    mutationFn: async (data: { responseId: number; userId: number }) => {
      await customFetch.delete(
        `/forums/responses/${data.responseId}?user_id=${data.userId}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-responses", postId] });
      queryClient.invalidateQueries({ queryKey: ["forum-posts"] });
    },
  });

  // Toggle post like mutation
  const togglePostLikeMutation = useMutation({
    mutationFn: async (data: { postId: number; userId: number }) => {
      const { data: response } = await customFetch.post(
        `/forums/posts/${data.postId}/like?user_id=${data.userId}`
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["forum-posts"] });
    },
  });

  // Toggle response like mutation
  const toggleResponseLikeMutation = useMutation({
    mutationFn: async (data: { responseId: number; userId: number }) => {
      const { data: response } = await customFetch.post(
        `/forums/responses/${data.responseId}/like?user_id=${data.userId}`
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-responses", postId] });
    },
  });

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: async (data: { postId: number; userId: number }) => {
      await customFetch.delete(
        `/forums/posts/${data.postId}?user_id=${data.userId}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-posts"] });
    },
  });

  // Report post mutation
  const reportPostMutation = useMutation({
    mutationFn: async (data: { postId: number; reason: string }) => {
      const { data: response } = await customFetch.post(
        `/forums/posts/${data.postId}/report`,
        { reason: data.reason }
      );
      return response;
    },
  });

  return {
    // Data
    post,
    responses: responses || [],

    // Loading states
    postLoading,
    responsesLoading,

    // Error states
    postError,
    responsesError,

    // Actions
    refetchPost,
    refetchResponses,

    // Mutations
    createResponse: createResponseMutation.mutate,
    createResponseLoading: createResponseMutation.isPending,
    deleteResponse: deleteResponseMutation.mutate,
    deleteResponseLoading: deleteResponseMutation.isPending,
    togglePostLike: togglePostLikeMutation.mutate,
    togglePostLikeLoading: togglePostLikeMutation.isPending,
    toggleResponseLike: toggleResponseLikeMutation.mutate,
    toggleResponseLikeLoading: toggleResponseLikeMutation.isPending,
    deletePost: deletePostMutation.mutate,
    deletePostLoading: deletePostMutation.isPending,
    reportPost: reportPostMutation.mutate,
    reportPostLoading: reportPostMutation.isPending,
  };
};
