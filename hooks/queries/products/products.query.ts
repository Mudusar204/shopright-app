import { getProducts } from "@/services/products.services";
import { useQuery } from "@tanstack/react-query";

const useGetProducts = () => {
  return useQuery({
    queryKey: ["all-products"],
    queryFn: () => {
      return getProducts();
    },
    // staleTime: 60 * 5000, //5 minutes
  });
};

export { useGetProducts };
