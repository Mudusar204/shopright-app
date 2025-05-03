import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "@/utils";
import { createPost, likeAndDislike } from "@/services/post.services";

const createNewPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => {
      console.warn(payload, "payload");
      return createPost(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["createPost"],
      });
    },
    onError(error) {
      console.error("createPost", getErrorMessage(error));
    },
  });
};

const likeDislikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { type: string; _id: string }) => {
      return likeAndDislike(data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["likePost"],
      });
    },
    onError(error) {
      console.error("likePost", getErrorMessage(error));
    },
  });
};

export { createNewPost, likeDislikePost };
