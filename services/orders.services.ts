import apiClient from "@/config/apiClient";
import { API_ROUTES } from "@/constants/api.routes";
import { useAuthStore } from "@/store/auth.store";
import axios from "axios";

export const createOrder = async (data: any) => {
  console.log("create order data", data);
  const { odooAdmin } = useAuthStore();
  const user = useAuthStore.getState().odooUser;
  if (!odooAdmin) {
    throw new Error("Odoo user auth not found");
  }
  console.log(odooAdmin, "odooUserAuth", user, "user");
  try {
    const orderLine = data.items.map((item: any) => [
      0,
      0,
      {
        product_id: parseInt(item.productId),
        product_uom_qty: item.quantity,
      },
    ]);
    console.log("orderLine", orderLine);
    const response = await axios.post(
      `http://69.62.120.81:8088/send_request?model=sale.order`,
      {
        fields: ["partner_id", "order_line"],
        values: {
          partner_id: 1,
          order_line: orderLine,
          // [
          //   [
          //     0,
          //     0,
          //     {
          //       product_id: 1,
          //       product_uom_qty: 5,
          //     },
          //   ],
          //   [
          //     0,
          //     0,
          //     {
          //       product_id: 1,
          //       product_uom_qty: 3,
          //     },
          //   ],
          // ],
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
  const response = await apiClient.get(API_ROUTES.ORDERS["GET_MY_ORDERS"]);

  return response.data;
};

export const getOrderById = async (orderId: number) => {
  const response = await apiClient.get(
    API_ROUTES.ORDERS.GET_ORDER_BY_ID(orderId)
  );
  return response.data;
};
