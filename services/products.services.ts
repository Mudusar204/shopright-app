import apiClient from "@/config/apiClient";
import { API_ROUTES } from "@/constants/api.routes";
import { useAuthStore } from "@/store/auth.store";
import axios from "axios";
import { productsCache } from "@/utils/cache";

export const getProducts = async () => {
  const odooAdmin = useAuthStore.getState().odooAdmin;
  console.log(odooAdmin, "admin credentials in getProducts");
  if (!odooAdmin) {
    throw new Error("Odoo user auth not found");
  }
  console.log(odooAdmin, "admin credentials in getProducts");

  try {
    // Try to fetch from API first
    const response = await axios.get(
      `${process.env.EXPO_PUBLIC_ODOO_API_URL}/send_request?model=product.product&is_published=True&fields=id,description_ecommerce,display_name,list_price,barcode,categ_id,currency_id,image_1920,public_categ_ids,alternative_product_ids`,
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

    // Save to cache after successful API call
    if (response.data) {
      await productsCache.set(response.data);
    }

    return response.data;
  } catch (error) {
    console.log(error, "error in getProducts");

    // If API fails, try to load from cache
    const cachedData = await productsCache.get();
    if (cachedData) {
      console.log("Using cached products data due to API error");
      return cachedData;
    }

    // If no cache available, re-throw the error
    throw error;
  }
};

/**
 * Load products from cache only (for initial fast load)
 * This is used to show cached data immediately while API call is in progress
 */
export const getProductsFromCache = async () => {
  return await productsCache.get();
};
