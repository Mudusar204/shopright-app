import { getOdooUser, getUserAddresses } from "@/services/auth.services";
import { getRiderLocation } from "@/services/rider.services";
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

export const useGetUserAddresses = () => {
  return useQuery({
    queryKey: ["user-addresses"],
    queryFn: () => {
      return getUserAddresses();
    },
    // staleTime: 60 * 5000, //5 minutes
  });
};

export const useGetRiderLocation = (riderId: string) => {
  return useQuery({
    queryKey: ["rider-location"],
    queryFn: () => {
      return getRiderLocation(riderId);
    },
  });
};
