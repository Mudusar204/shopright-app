import { getAllPosts } from "@/services/post.services";
import {
  keepPreviousData,
  useQuery,
  GetNextPageParamFunction,
} from "@tanstack/react-query";

const useAllPosts = ({ page, limit }: { page: number; limit: number }) => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: () => {
      return getAllPosts({ page, limit });
    },
    staleTime: 60 * 5000, //5 minutes
  });
};

export { useAllPosts };
