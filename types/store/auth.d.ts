interface AuthStoreState {
  isLoggedIn: boolean;
  isLoading: boolean;
  odooUser?: OdooUser | null;
  expoPushToken?: string | null;
  userLocations?: any[] | null;
  odooAdmin?: OdooAdmin | null;
  odooUserAuth?: OdooUserAuth | null;
  isOnboarded: boolean;
  notificationsEnabled?: boolean | null; // null = not set, true = enabled, false = user disabled
}

interface AuthStoreActions {
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setOdooUser: (user: OdooUser | null) => void;
  setOdooUserAuth: (userAuth: OdooUserAuth | null) => void;
  setOdooAdmin: () => void;
  setExpoPushToken: (expoPushToken: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setOnboarded: (isOnboarded: boolean) => void;
  setNotificationsEnabled: (enabled: boolean | null) => void;
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
  id: string;
  partner_id: string;
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

interface UserLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
}

export {
  AuthStoreState,
  AuthStoreActions,
  OdooUser,
  OdooUserAuth,
  OdooAdmin,
  UserLocation,
};
