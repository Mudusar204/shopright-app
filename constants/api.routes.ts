export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    OTP_VERIFICATION: "/auth/verify-otp",
    RESEND_OTP: "/auth/resend-otp",
    LOGOUT: "/auth/logout",
  },
  USER: {
    REGISTER: "/user/register",
    GET_USER: "/user",
    GET_USER_ADDRESSES: "/user/get-all-addresses",
    ADD_USER_ADDRESS: "/user/add-address",
  },
  ORDERS: {
    CREATE_ORDER: "/orders/create-order",
    GET_MY_ORDERS: "/orders/my-orders",
    GET_ALL_ORDERS: "/orders/all-orders",
    GET_ORDER_BY_ID: (id: number) => `/orders/${id}`,
  },
  PRODUCTS: {
    GET_ALL_PRODUCTS: "/products/all-products",
    GET_PRODUCT_BY_ID: "/products/:id",
    CREATE_PRODUCT: "/products/create-product",
    UPDATE_PRODUCT: "/products/:id",
    DELETE_PRODUCT: "/products/:id",
  },
  CATEGORIES: {
    GET_ALL_CATEGORIES: "/categories",
    GET_CATEGORY_BY_ID: (id: string) => `/categories/${id}`,
    CREATE_CATEGORY: "/categories",
    UPDATE_CATEGORY: (id: string) => `/categories/${id}`,
    DELETE_CATEGORY: (id: string) => `/categories/${id}`,
  },
  BRANDS: {
    GET_ALL_BRANDS: "/brands",
    GET_BRAND_BY_ID: (id: string) => `/brands/${id}`,
    CREATE_BRAND: "/brands",
    UPDATE_BRAND: (id: string) => `/brands/${id}`,
    DELETE_BRAND: (id: string) => `/brands/${id}`,
  },
  RIDER: {
    GET_RIDER_LOCATION: (riderId: string) => `/riders/${riderId}/location`,
  },
};
