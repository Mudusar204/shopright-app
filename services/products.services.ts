import apiClient from "@/config/apiClient";
import { API_ROUTES } from "@/constants/api.routes";
import { useAuthStore } from "@/store/auth.store";
import axios from "axios";
export const getProducts = async () => {
  const odooAdmin = useAuthStore.getState().odooAdmin;
  console.log(odooAdmin, "admin credentials in getProducts");
  if (!odooAdmin) {
    throw new Error("Odoo user auth not found");
  }
  console.log(odooAdmin, "admin credentials in getProducts");
  try {
    const response = await axios.get(
      `http://69.62.120.81:8088/send_request?model=product.product&fields=id,description_ecommerce,display_name,list_price,barcode,categ_id,currency_id,image_1920,public_categ_ids`,
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
    console.log(error, "error in getProducts");
  }
};
