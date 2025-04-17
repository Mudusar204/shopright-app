interface AuthStoreState {
  isLoggedIn: boolean;
  isLoading: boolean;
  token: string | null;
  user?: User | null;
  isOnboarded: boolean;
  searchedUsers: User[];
}

interface AuthStoreActions {
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUser: (user: User | null) => void;
  setToken: (token: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setOnboarded: (isOnboarded: boolean) => void;
  setSearchedUsers: (searchedUsers: any[]) => void;
  clear: () => void;
}

interface User {
  _id: string;
  name: string;
  email: string;
  iso_code?: string;
  phone_number?: string;
  counntry_code?: string;
  followers?: any[];
  following?: any[];
  posts?: any[];
  profile_image?: string;
  location?: any;
  alerts?: boolean;
  notifications?: boolean;
}

export { AuthStoreState, AuthStoreActions, User };
