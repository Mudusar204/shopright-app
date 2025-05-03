export const API_ROUTES = {
  AUTH: {
    LOGIN: "users/login",
    REGISTER: "users/register",
    OTP_VERIFICATION: "users/verify-otp",
    RESEND_OTP: "users/resend-otp",
    LOGOUT: "users/logout",
  },
  USER: {
    GET_USER_INFO: "user/get-user-info",
  },
  POST: {
    CREATE_POST: "post/create-post",
    GET_ALL_POSTS: "post/get-all-posts",
    LIKE_DISLIKE: "post/like-dislike",
  },
};
