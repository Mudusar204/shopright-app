import { getOdooUser } from "@/services/auth.services";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGetOdooUser = () => {
  return useQuery({
    queryKey: ["getOdooUser"],
    queryFn: () => {
      console.log("getOdooUser called");
      return getOdooUser();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
