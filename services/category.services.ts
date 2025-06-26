import apiClient from "@/config/apiClient";
import { API_ROUTES } from "@/constants/api.routes";
import { useAuthStore } from "@/store/auth.store";
import axios from "axios";
export const getCategories = async () => {
  const odooUserAuth = useAuthStore.getState().odooUserAuth;
  if (!odooUserAuth) {
    throw new Error("Odoo user auth not found");
  }
  console.log(odooUserAuth, "odooUserAuth");
  try {
    const response = await axios.get(
      "http://69.62.120.81:8088/send_request?model=product.public.category",
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": odooUserAuth.api_key,
          login: odooUserAuth.login,
          password: odooUserAuth.password,
          db: odooUserAuth.db,
        },
      }
    );

    // const response = await odooApiClient.get(`/send_request?model=res.users`);
    console.log(response, "getCategories response");
    return response.data;
  } catch (error) {
    console.log(error, "error in getCategories");
  }
};
