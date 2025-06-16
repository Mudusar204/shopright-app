import { getAllProducts } from "@/services/products.services";
import { useQuery } from "@tanstack/react-query";

const useGetAllProducts = () => {
  return useQuery({
    queryKey: ["all-products"],
    queryFn: () => {
      return getAllProducts();
    },
    // staleTime: 60 * 5000, //5 minutes
  });
};

export { useGetAllProducts };
