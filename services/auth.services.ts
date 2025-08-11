import apiClient from "@/config/apiClient";
import odooApiClient from "@/config/odooApiClient";
import { API_ROUTES } from "@/constants/api.routes";
import { useAuthStore } from "@/store/auth.store";
import axios from "axios";

export const login = async (data: any) => {
  const response = await axios.get(
    `${process.env.EXPO_PUBLIC_ODOO_API_URL}/odoo_connect`,
    {
      headers: {
        "Content-Type": "application/json",
        login: data.identifier,
        password: data.password,
        db: "Testing",
      },
    }
  );
  console.log(response.data, "login response");
  return response.data;
};

export const getOdooUser = async () => {
  const odooAdmin = useAuthStore.getState().odooAdmin;
  const odooUserAuth = useAuthStore.getState().odooUserAuth;

  if (!odooAdmin) {
    throw new Error("Odoo user auth not found");
  }
  console.log(odooAdmin, "odooUserAuth");
  try {
    const response = await axios.get(
      `${process.env.EXPO_PUBLIC_ODOO_API_URL}/send_request?model=res.users&id=${odooUserAuth?.id}&fields=name,login,phone`,
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
    // console.log(response, "getOdooUser response");
    return response.data;
  } catch (error) {
    console.log(error, "error in getOdooUser");
  }
};

export const register = async (data: any) => {
  const odooAdmin = useAuthStore.getState().odooAdmin;
  if (!odooAdmin) {
    throw new Error("Odoo user auth not found");
  }
  console.log(odooAdmin, "odooAdmin in create user");
  try {
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_ODOO_API_URL}/send_request?model=res.users`,
      {
        fields: ["login", "name", "password"],
        values: {
          login: data.login,
          phone: data.phone,
          name: data.name,
          password: data.password,
        },
      },
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
    console.log(response, "getOdooUser response");
    return response.data;
  } catch (error) {
    console.log(error, "error in getOdooUser");
  }
};

export const addUserAddress = async (data: any) => {
  const odooAdmin = useAuthStore.getState().odooAdmin;
  const user = useAuthStore.getState().odooUserAuth;
  console.log(data, "data in addUserAddress", user?.partner_id);
  if (!odooAdmin) {
    throw new Error("Odoo user auth not found");
  }
  console.log(odooAdmin, "odooAdmin in create user");
  try {
    const response = await axios.put(
      `${process.env.EXPO_PUBLIC_ODOO_API_URL}/send_request?model=res.partner&Id=${user?.partner_id}`,
      {
        fields: [
          "type",
          "street",
          "street2",
          "city",
          "zip",
          "state",
          "country",
          "partner_latitude",
          "partner_longitude",
        ],
        values: {
          type: "other",
          street: data.street,
          street2: data.street2,
          city: data.city,
          zip: data.zip,
          state: data.state,
          country: data.country,
          partner_latitude: data.latitude,
          partner_longitude: data.longitude,
        },
      },
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
    console.log(response, "add user address response");
    return response.data;
  } catch (error) {
    console.log(error, "error in addUserAddress");
  }
};
export const getUserAddresses = async () => {
  const odooAdmin = useAuthStore.getState().odooAdmin;
  const user = useAuthStore.getState().odooUserAuth;
  console.log(user, "user in getUserAddresses");
  if (!odooAdmin) {
    throw new Error("Odoo user auth not found");
  }
  console.log(odooAdmin, "odooUserAddresses");
  try {
    const response = await axios.get(
      `${process.env.EXPO_PUBLIC_ODOO_API_URL}/send_request?model=res.partner&Id=${user?.partner_id}&fields=name,email,zip,street,street2,city,state,country,parent_id,type,partner_latitude,partner_longitude`,
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
    console.log(response.data, "getUserAddresses response");
    return response.data;
  } catch (error) {
    console.log(error, "error in getOdooUser");
  }
};

export const logout = async (data: any) => {
  const response = await apiClient.get(API_ROUTES.AUTH["LOGOUT"], {
    params: {
      userId: data.user_id, // Pass user_id as a query parameter
    },
  });

  return response.data;
};
