import { getBrands, getCategories } from "@/services/category.services";
import { useQuery } from "@tanstack/react-query";

const useGetBrands = () => {
  return useQuery({
    queryKey: ["all-brands"],
    queryFn: () => {
      return getBrands();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - data is considered fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch when component mounts if data exists
    retry: 2, // Retry failed requests 2 times
  });
};

export { useGetBrands };
