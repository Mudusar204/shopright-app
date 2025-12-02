import apiClient from "@/config/apiClient";
import { API_ROUTES } from "@/constants/api.routes";
import { useAuthStore } from "@/store/auth.store";
import axios from "axios";
export const getCategories = async () => {
  const { odooAdmin } = useAuthStore.getState();
  if (!odooAdmin) {
    throw new Error("Odoo user auth not found");
  }
  console.log(odooAdmin, "odooUserAuth");
  try {
    const response = await axios.get(
      `${process.env.EXPO_PUBLIC_ODOO_API_URL}/send_request?model=product.public.category&fields=id,name`,
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": odooAdmin.api_key,
          login: odooAdmin.login,
          password: odooAdmin.password,
          db: odooAdmin.db,
        },
      }
    );

    // const response = await odooApiClient.get(`/send_request?model=res.users`);
    return response.data;
  } catch (error) {
    console.log(error, "error in getCategories");
  }
};

export const getBrands = async () => {
  const { odooAdmin } = useAuthStore.getState();
  if (!odooAdmin) {
    throw new Error("Odoo user auth not found");
  }
  console.log(odooAdmin, "odooUserAuth");
  try {
    const response = await axios.get(
      `${process.env.EXPO_PUBLIC_ODOO_API_URL}/send_request?model=dr.product.brand`,
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": odooAdmin.api_key,
          login: odooAdmin.login,
          password: odooAdmin.password,
          db: odooAdmin.db,
        },
      }
    );

    // const response = await odooApiClient.get(`/send_request?model=res.users`);
    return response.data;
  } catch (error) {
    console.log(error, "error in getBrands");
  }
};

export const getSliderImages = async () => {
  const { odooAdmin } = useAuthStore.getState();
  if (!odooAdmin) {
    throw new Error("Odoo user auth not found");
  }
  console.log(odooAdmin, "odooUserAuth");
  try {
    const response = await axios.get(
      `${process.env.EXPO_PUBLIC_ODOO_API_URL}/send_request?model=slider.image&fields=id,img_url`,
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": odooAdmin.api_key,
          login: odooAdmin.login,
          password: odooAdmin.password,
          db: odooAdmin.db,
        },
      }
    );

    // const response = await odooApiClient.get(`/send_request?model=res.users`);
    return response.data;
  } catch (error) {
    console.log(error, "error in getBrands");
  }
};
