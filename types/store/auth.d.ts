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
  firstName: string;
  lastName: string;
  nickName: string;
  email: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  phoneNumber?: string;
  profile_image?: string;
  location?: any;
}

export { AuthStoreState, AuthStoreActions, User };
