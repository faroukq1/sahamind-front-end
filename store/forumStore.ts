import { create } from "zustand";

export interface ForumPost {
  id: number;
  forum_id: number;
  author_id: number;
  title: string;
  content: string;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
  is_reported: boolean;
  author_name: string;
  response_count: number;
  like_count: number;
}

export interface Forum {
  id: number;
  name: string;
  description: string;
  thematic: string;
  created_at: string;
  is_active: boolean;
  moderator_count: number;
  post_count: number;
}

interface ForumState {
  selectedForum: Forum | null;
  forums: Forum[];
  posts: ForumPost[];

  setSelectedForum: (forum: Forum | null) => void;
  setForums: (forums: Forum[]) => void;
  setPosts: (posts: ForumPost[]) => void;
  addPost: (post: ForumPost) => void;
  updatePost: (postId: number, post: ForumPost) => void;
  deletePost: (postId: number) => void;
  likePost: (postId: number) => void;
  reset: () => void;
}

const initialState = {
  selectedForum: null,
  forums: [],
  posts: [],
};

export const useForumStore = create<ForumState>()((set) => ({
  ...initialState,

  setSelectedForum: (forum) =>
    set({
      selectedForum: forum,
    }),

  setForums: (forums) =>
    set({
      forums,
    }),

  setPosts: (posts) =>
    set({
      posts,
    }),

  addPost: (post) =>
    set((state) => ({
      posts: [post, ...state.posts],
    })),

  updatePost: (postId, post) =>
    set((state) => ({
      posts: state.posts.map((p) => (p.id === postId ? post : p)),
    })),

  deletePost: (postId) =>
    set((state) => ({
      posts: state.posts.filter((p) => p.id !== postId),
    })),

  likePost: (postId) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId ? { ...p, like_count: p.like_count + 1 } : p
      ),
    })),

  reset: () => set(initialState),
}));
