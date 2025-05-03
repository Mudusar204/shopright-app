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
  phoneNumber?: string;
  country_code?: string;
  profile_image?: string;
  location?: any;
  alerts?: boolean;
  notifications?: boolean;
}

export { AuthStoreState, AuthStoreActions, User };
