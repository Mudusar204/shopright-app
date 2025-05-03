import axios from "axios";
export const getErrorMessage = (error: any): string => {
  console.log(error, "error in utils");
  if (axios.isAxiosError(error)) {
    return String(
      error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        "An error occurred"
    );
  }
  return String(
    error?.response?.data?.message ??
      error?.response?.data ??
      "An error occurred"
  );
};
