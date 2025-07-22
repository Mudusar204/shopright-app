import apiClient from "@/config/apiClient";
import odooApiClient from "@/config/odooApiClient";
import { API_ROUTES } from "@/constants/api.routes";
import { useAuthStore } from "@/store/auth.store";
import axios from "axios";

export const getRiderLocation = async (riderId: string) => {
  const response = await apiClient.get(
    API_ROUTES.RIDER.GET_RIDER_LOCATION(riderId)
  );
  console.log(response.data, "getRider response");

  return response.data;
};
