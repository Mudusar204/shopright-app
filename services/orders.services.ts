import apiClient from "@/config/apiClient";
import { API_ROUTES } from "@/constants/api.routes";
import { useAuthStore } from "@/store/auth.store";
import axios from "axios";

export const createOrder = async (data: any) => {
  console.log("create order data", data);
  const odooAdmin = useAuthStore.getState().odooAdmin;
  const user = useAuthStore.getState().odooUserAuth;
  if (!odooAdmin) {
    throw new Error("Odoo user auth not found");
  }
  console.log(odooAdmin, "odooUserAuth", user, "user");
  try {
    const orderLine = data.items.map((item: any) => [
      0,
      0,
      {
        product_id: item.productId,
        product_uom_qty: item.quantity,
      },
    ]);
    console.log("orderLine", orderLine);
    const response = await axios.post(
      `http://69.62.120.81:8088/send_request?model=sale.order`,
      {
        fields: ["partner_id", "state", "order_line"],
        values: {
          partner_id: user?.partner_id,
          state: "sale",
          order_line: orderLine,
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
    console.log(response, "createOrder response");
    return response.data;
  } catch (error) {
    console.log(error, "error in createOrder");
  }
};

export const getMyOrders = async () => {
  const odooAdmin = useAuthStore.getState().odooAdmin;
  const user = useAuthStore.getState().odooUserAuth;
  if (!odooAdmin) {
    throw new Error("Odoo user auth not found");
  }
  console.log(odooAdmin, "odooUserAuth");
  try {
    const response = await axios.get(
      `http://69.62.120.81:8088/send_request?model=sale.order&partner_id=${user?.partner_id}&fields=id,name,order_line,date_order,state,delivery_status,amount_paid,amount_total,partner_shipping_id`,
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
    console.log(response, "getMyOrders response");
    return response.data;
  } catch (error) {
    console.log(error, "error in getMyOrders");
  }
};

export const getOrderById = async (orderId: number) => {
  const odooAdmin = useAuthStore.getState().odooAdmin;
  console.log(orderId, "orderId in getOrderById");
  if (!odooAdmin) {
    throw new Error("Odoo user auth not found");
  }
  console.log(odooAdmin, "odooUserAuth");
  try {
    const response = await axios.get(
      `http://69.62.120.81:8088/send_request?model=sale.order&Id=${orderId}&fields=id,name,order_line,date_order,state,delivery_status,amount_paid,amount_total,partner_shipping_id`,
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
    console.log(response, "getOrderById response");
    return response.data;
  } catch (error) {
    console.log(error, "error in getOrderById");
  }
};
