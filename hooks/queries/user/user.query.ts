import { getUserAddresses } from "@/services/user.services";
import { useQuery } from "@tanstack/react-query";

const useGetUserAddresses = () => {
  return useQuery({
    queryKey: ["user-addresses"],
    queryFn: () => {
      return getUserAddresses();
    },
    // staleTime: 60 * 5000, //5 minutes
  });
};

export { useGetUserAddresses };
