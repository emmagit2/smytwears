import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,  // data fresh for 5 mins
      gcTime:    1000 * 60 * 10, // keep cache for 10 mins
      retry: 1,
    },
  },
});