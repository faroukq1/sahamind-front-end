import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { customFetch } from "@/utils/customFetch";

export interface Volunteer {
  id: number;
  email: string;
  role: string;
  emotions_kw: string[];
  availability_date: string | null;
  availability_start_time: string | null;
  availability_end_time: string | null;
  is_active: boolean;
  created_at: string;
}

// Fetch volunteers by user's emotions with pagination
export const useVolunteersByEmotionPaginated = (
  userId: number | undefined,
  pageSize: number = 5
) => {
  return useInfiniteQuery({
    queryKey: ["volunteers", "by-emotions-paginated", userId, pageSize],
    queryFn: async ({ pageParam = 0 }) => {
      if (!userId) {
        // Fallback to available volunteers if no user ID
        const { data } = await customFetch.get<Volunteer[]>(
          "/volunteers/available"
        );
        // Simulate pagination
        const start = pageParam * pageSize;
        const end = start + pageSize;
        return {
          volunteers: data.slice(start, end),
          nextPage: end < data.length ? pageParam + 1 : undefined,
        };
      }

      try {
        const { data } = await customFetch.get<Volunteer[]>(
          `/volunteers/by-emotions/${userId}`
        );
        // Simulate pagination
        const start = pageParam * pageSize;
        const end = start + pageSize;
        return {
          volunteers: data.slice(start, end),
          nextPage: end < data.length ? pageParam + 1 : undefined,
        };
      } catch (error: any) {
        // If no matching volunteers or user has no emotions, fetch available volunteers
        if (error.response?.status === 404 || !error.response) {
          const { data } = await customFetch.get<Volunteer[]>(
            "/volunteers/available"
          );
          // Simulate pagination
          const start = pageParam * pageSize;
          const end = start + pageSize;
          return {
            volunteers: data.slice(start, end),
            nextPage: end < data.length ? pageParam + 1 : undefined,
          };
        }
        throw error;
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Fetch volunteers by user's emotions
export const useVolunteersByEmotion = (userId: number | undefined) => {
  return useQuery({
    queryKey: ["volunteers", "by-emotions", userId],
    queryFn: async () => {
      if (!userId) {
        // Fallback to available volunteers if no user ID
        const { data } = await customFetch.get<Volunteer[]>(
          "/volunteers/available"
        );
        return data;
      }

      try {
        const { data } = await customFetch.get<Volunteer[]>(
          `/volunteers/by-emotions/${userId}`
        );
        return data;
      } catch (error: any) {
        // If no matching volunteers or user has no emotions, fetch available volunteers
        if (error.response?.status === 404 || !error.response) {
          const { data } = await customFetch.get<Volunteer[]>(
            "/volunteers/available"
          );
          return data;
        }
        throw error;
      }
    },
    enabled: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Fetch all available volunteers
export const useAvailableVolunteers = () => {
  return useQuery({
    queryKey: ["volunteers", "available"],
    queryFn: async () => {
      const { data } = await customFetch.get<Volunteer[]>(
        "/volunteers/available"
      );
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Fetch all volunteers (limited to 5)
export const useAllVolunteers = () => {
  return useQuery({
    queryKey: ["volunteers", "all"],
    queryFn: async () => {
      const { data } = await customFetch.get<Volunteer[]>("/volunteers/");
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

interface PaginatedVolunteersResponse {
  volunteers: Volunteer[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

// Fetch all volunteers with pagination
export const useAllVolunteersPaginated = (pageSize: number = 10) => {
  return useInfiniteQuery({
    queryKey: ["volunteers", "all-paginated", pageSize],
    queryFn: async ({ pageParam = 1 }) => {
      console.log(
        `Fetching paginated volunteers: page=${pageParam}, pageSize=${pageSize}`
      );
      try {
        const { data } = await customFetch.get<PaginatedVolunteersResponse>(
          `/volunteers/paginated?page=${pageParam}&page_size=${pageSize}`
        );
        console.log("Paginated volunteers response:", data);
        return data;
      } catch (error) {
        console.error("Error fetching paginated volunteers:", error);
        throw error;
      }
    },
    getNextPageParam: (lastPage) =>
      lastPage.has_next ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
