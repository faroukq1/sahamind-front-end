import { customFetch } from "@/utils/customFetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  email: string;
  password: string;
  emotions_kw?: string[];
}

interface AuthResponse {
  message: string;
  user_id: number;
}

export const useAuth = () => {
  const queryClient = useQueryClient();

  const {
    user,
    isAuthenticated,
    isHydrated,
    setUser,
    logout: logoutStore,
  } = useAuthStore();

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: async (
      credentials: LoginCredentials
    ): Promise<AuthResponse> => {
      const { data } = await customFetch.post("/auth/login", credentials);
      return data;
    },
    onSuccess: (data, variables) => {
      setUser({
        id: data.user_id,
        email: variables.email,
      });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  // Register Mutation
  const registerMutation = useMutation({
    mutationFn: async (
      credentials: RegisterCredentials
    ): Promise<AuthResponse> => {
      const { data } = await customFetch.post("/auth/signup", credentials);
      return data;
    },
    onSuccess: (data, variables) => {
      setUser({
        id: data.user_id.toString(),
        email: variables.email,
        emotions_kw: variables.emotions_kw,
      });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  // Logout Mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {},
    onSuccess: () => {
      logoutStore();
      queryClient.clear();
    },
  });

  // Single loading state for all operations
  const isLoading =
    loginMutation.isPending ||
    registerMutation.isPending ||
    logoutMutation.isPending;

  // Single error state for all operations
  const error =
    loginMutation.error || registerMutation.error || logoutMutation.error;

  // Login function
  const login = async (credentials: LoginCredentials) => {
    try {
      const result = await loginMutation.mutateAsync(credentials);
      return { success: true, data: result };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      throw new Error(errorMessage);
    }
  };

  // Register function
  const register = async (credentials: RegisterCredentials) => {
    try {
      const result = await registerMutation.mutateAsync(credentials);
      return { success: true, data: result };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Registration failed";
      throw new Error(errorMessage);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error: any) {
      throw error;
    }
  };

  return {
    // User state
    user,
    isAuthenticated,
    isHydrated,

    // Actions
    login,
    register,
    logout,

    // Single loading state
    isLoading,

    // Single error state
    error,
  };
};
