import apiClient from "@/config/apiClient";
import odooApiClient from "@/config/odooApiClient";
import { API_ROUTES } from "@/constants/api.routes";
import { useAuthStore } from "@/store/auth.store";
import axios from "axios";

export const login = async (data: any) => {
  const response = await axios.get(`http://69.62.120.81:8088/odoo_connect`, {
    headers: {
      "Content-Type": "application/json",
      login: data.identifier,
      password: data.password,
      db: "Testing",
    },
  });
  console.log(response.data, "login response");
  return response.data;
};

export const getOdooUser = async () => {
  const odooAdmin = useAuthStore.getState().odooAdmin;

  if (!odooAdmin) {
    throw new Error("Odoo user auth not found");
  }
  console.log(odooAdmin, "odooUserAuth");
  try {
    const response = await axios.get(
      `http://69.62.120.81:8088/send_request?model=res.users&Id=2`,
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
      `http://69.62.120.81:8088/send_request?model=res.users`,
      {
        fields: ["login", "name", "password"],
        values: {
          login: data.login,
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

  if (!odooAdmin) {
    throw new Error("Odoo user auth not found");
  }
  console.log(odooAdmin, "odooAdmin in create user");
  try {
    const response = await axios.put(
      `http://69.62.120.81:8088/send_request?model=res.partner&Id=${user?.partner_id}`,
      {
        fields: ["type", "zip", "street", "city"],
        values: {
          type: "other",
          zip: data.zip,
          street: data.street,

          city: data.city,
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
      `http://69.62.120.81:8088/send_request?model=res.partner&Id=${user?.partner_id}&fields=name,email,zip,street,street2,city,state_id,country_id,parent_id,type`,
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
