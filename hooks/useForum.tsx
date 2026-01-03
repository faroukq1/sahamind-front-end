import { customFetch } from "@/utils/customFetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForumStore, Forum, ForumPost } from "@/store/forumStore";

export const useForum = () => {
  const queryClient = useQueryClient();
  const {
    selectedForum,
    forums,
    posts,
    setSelectedForum,
    setForums,
    setPosts,
    addPost,
    updatePost,
    deletePost,
    likePost,
    reset,
  } = useForumStore();

  // Fetch all forums
  const {
    data: forumsData,
    isLoading: forumsLoading,
    error: forumsError,
    refetch: refetchForums,
  } = useQuery({
    queryKey: ["forums"],
    queryFn: async () => {
      const { data } = await customFetch.get("/forums/");
      return data as Forum[];
    },
    onSuccess: (data) => {
      setForums(data);
    },
  });

  // Fetch posts for selected forum
  const {
    data: postsData,
    isLoading: postsLoading,
    error: postsError,
    refetch: refetchPosts,
  } = useQuery({
    queryKey: ["forum-posts", selectedForum?.id],
    queryFn: async () => {
      if (!selectedForum) return [];
      const { data } = await customFetch.get(
        `/forums/${selectedForum.id}/posts`
      );
      return data as ForumPost[];
    },
    enabled: !!selectedForum,
    onSuccess: (data: any) => {
      setPosts(data);
    },
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (postData: {
      forum_id: number;
      user_id: number;
      title: string;
      content: string;
      is_anonymous: boolean;
    }) => {
      const { data } = await customFetch.post("/forums/posts", postData);
      return data as ForumPost;
    },
    onSuccess: (newPost) => {
      addPost(newPost);
      queryClient.invalidateQueries({ queryKey: ["forum-posts"] });
    },
  });

  // Update post mutation
  const updatePostMutation = useMutation({
    mutationFn: async (postData: {
      post_id: number;
      user_id: number;
      title: string;
      content: string;
    }) => {
      const { data } = await customFetch.put(
        `/forums/posts/${postData.post_id}`,
        {
          user_id: postData.user_id,
          title: postData.title,
          content: postData.content,
        }
      );
      return data as ForumPost;
    },
    onSuccess: (updatedPost) => {
      updatePost(updatedPost.id, updatedPost);
      queryClient.invalidateQueries({
        queryKey: ["forum-posts", selectedForum?.id],
      });
    },
  });

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      await customFetch.delete(`/forums/posts/${postId}`);
    },
    onSuccess: (_, postId) => {
      deletePost(postId);
      queryClient.invalidateQueries({
        queryKey: ["forum-posts", selectedForum?.id],
      });
    },
  });

  // Like post mutation
  const likePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      const { data } = await customFetch.post(`/forums/posts/${postId}/like`);
      return data;
    },
    onSuccess: (_, postId) => {
      likePost(postId);
    },
  });

  return {
    // State
    selectedForum,
    forums: forumsData || forums,
    posts: postsData || posts,

    // Loading states
    forumsLoading,
    postsLoading,

    // Error states
    forumsError,
    postsError,

    // Actions
    setSelectedForum,
    refetchForums,
    refetchPosts,
    reset,

    // Mutations
    createPost: createPostMutation.mutate,
    createPostLoading: createPostMutation.isPending,
    updatePost: updatePostMutation.mutate,
    updatePostLoading: updatePostMutation.isPending,
    deletePost: deletePostMutation.mutate,
    deletePostLoading: deletePostMutation.isPending,
    likePost: likePostMutation.mutate,
    likePostLoading: likePostMutation.isPending,
  };
};
