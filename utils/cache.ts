import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_KEYS = {
  PRODUCTS: "@products_cache",
  PRODUCTS_TIMESTAMP: "@products_cache_timestamp",
};

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Cache utility for storing and retrieving products data
 */
export const productsCache = {
  /**
   * Save products data to AsyncStorage with timestamp
   */
  set: async (data: any): Promise<void> => {
    try {
      const timestamp = Date.now();
      await AsyncStorage.multiSet([
        [CACHE_KEYS.PRODUCTS, JSON.stringify(data)],
        [CACHE_KEYS.PRODUCTS_TIMESTAMP, timestamp.toString()],
      ]);
      console.log("Products cache saved successfully");
    } catch (error) {
      console.error("Error saving products cache:", error);
    }
  },

  /**
   * Get products data from AsyncStorage if cache is valid
   * Returns null if cache doesn't exist or is expired
   */
  get: async (): Promise<any | null> => {
    try {
      const [cachedData, timestamp] = await AsyncStorage.multiGet([
        CACHE_KEYS.PRODUCTS,
        CACHE_KEYS.PRODUCTS_TIMESTAMP,
      ]);

      if (!cachedData[1] || !timestamp[1]) {
        console.log("No cached products found");
        return null;
      }

      const cacheAge = Date.now() - parseInt(timestamp[1], 10);
      if (cacheAge > CACHE_DURATION) {
        console.log("Products cache expired");
        return null;
      }

      const parsedData = JSON.parse(cachedData[1]);
      console.log("Products loaded from cache");
      return parsedData;
    } catch (error) {
      console.error("Error reading products cache:", error);
      return null;
    }
  },

  /**
   * Check if cache exists and is valid
   */
  isValid: async (): Promise<boolean> => {
    try {
      const timestamp = await AsyncStorage.getItem(CACHE_KEYS.PRODUCTS_TIMESTAMP);
      if (!timestamp) return false;

      const cacheAge = Date.now() - parseInt(timestamp, 10);
      return cacheAge <= CACHE_DURATION;
    } catch (error) {
      console.error("Error checking cache validity:", error);
      return false;
    }
  },

  /**
   * Clear products cache
   */
  clear: async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([
        CACHE_KEYS.PRODUCTS,
        CACHE_KEYS.PRODUCTS_TIMESTAMP,
      ]);
      console.log("Products cache cleared");
    } catch (error) {
      console.error("Error clearing products cache:", error);
    }
  },

  /**
   * Get cache age in hours
   */
  getCacheAge: async (): Promise<number | null> => {
    try {
      const timestamp = await AsyncStorage.getItem(CACHE_KEYS.PRODUCTS_TIMESTAMP);
      if (!timestamp) return null;

      const cacheAge = Date.now() - parseInt(timestamp, 10);
      return Math.floor(cacheAge / (60 * 60 * 1000)); // Return age in hours
    } catch (error) {
      console.error("Error getting cache age:", error);
      return null;
    }
  },
};

