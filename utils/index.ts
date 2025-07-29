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

/**
 * Utility function to handle image URLs consistently across the app
 * Converts HTTP to HTTPS for production builds and handles null/false values
 */
export const getImageSource = (imageUrl: any) => {
  // Handle null, undefined, or false values
  if (!imageUrl || imageUrl === false) {
    return require("@/assets/images/no-image.png");
  }

  // If it's already a require statement or local asset, return as is
  if (typeof imageUrl === "number") {
    return imageUrl;
  }

  // Handle string URLs
  if (typeof imageUrl === "string") {
    // Convert HTTP to HTTPS for production builds
    if (imageUrl.startsWith("http://")) {
      imageUrl = imageUrl.replace("http://", "https://");
    }
    return { uri: imageUrl };
  }

  // Fallback to default image
  return require("@/assets/images/no-image.png");
};
