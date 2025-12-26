import { getProducts } from "@/services/products.services";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { getProductsFromCache } from "@/services/products.services";

const useGetProducts = () => {
  const queryClient = useQueryClient();
  const cacheLoadedRef = useRef(false);

  // Load cached data and set it as initial data for React Query on first mount
  useEffect(() => {
    if (cacheLoadedRef.current) return;

    const loadCachedData = async () => {
      try {
        const cached = await getProductsFromCache();
        if (cached) {
          // Pre-populate React Query cache with cached data
          queryClient.setQueryData(["all-products"], cached);
          console.log("Pre-loaded products from AsyncStorage cache");
        }
      } catch (error) {
        console.error("Error loading cached products:", error);
      } finally {
        cacheLoadedRef.current = true;
      }
    };

    loadCachedData();
  }, [queryClient]);

  return useQuery({
    queryKey: ["all-products"],
    queryFn: () => {
      return getProducts();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - data is considered fresh for 5 minutes
    gcTime: 24 * 60 * 60 * 1000, // 24 hours - cache in memory for 24 hours
    retry: 2, // Retry failed requests 2 times
    retryDelay: 1000, // Wait 1 second between retries
    // Don't refetch on mount if we have cached data (will still fetch in background if stale)
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export { useGetProducts };
