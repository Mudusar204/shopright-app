interface AuthStoreState {
  isLoggedIn: boolean;
  isLoading: boolean;
  odooUser?: OdooUser | null;
  odooAdmin?: OdooAdmin | null;
  odooUserAuth?: OdooUserAuth | null;
  isOnboarded: boolean;
}

interface AuthStoreActions {
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setOdooUser: (user: OdooUser | null) => void;
  setOdooUserAuth: (userAuth: OdooUserAuth | null) => void;
  setOdooAdmin: (admin: OdooAdmin | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setOnboarded: (isOnboarded: boolean) => void;
  clear: () => void;
}

interface OdooUser {
  id: string;
  name: string;
  login: string;
  password: string;
  email: string;
  profile_image?: string;
  location?: any;
}

interface OdooUserAuth {
  api_key: string;
  login: string;
  password: string;
  db: string;
}

interface OdooAdmin {
  api_key: string;
  login: string;
  password: string;
  db: string;
}
export { AuthStoreState, AuthStoreActions, OdooUser, OdooUserAuth, OdooAdmin };
