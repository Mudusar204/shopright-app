import apiClient from "@/config/apiClient";
import { API_ROUTES } from "@/constants/api.routes";

export const createPost = async (data: any) => {
  const response = await apiClient.post(API_ROUTES.POST["CREATE_POST"], data);

  return response.data;
};

export const getAllPosts = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  const response = await apiClient.get(API_ROUTES.POST["GET_ALL_POSTS"], {
    params: { page, limit },
  });

  return response.data;
};

export const likeAndDislike = async (data: { type: string; _id: string }) => {
  console.log(data, "post like or unlike");

  const response = await apiClient.post(
    `${API_ROUTES.POST.LIKE_DISLIKE}/ ${data?.type}`,
    { _id: data?._id, type: data?.type }
  );

  return response.data;
};
