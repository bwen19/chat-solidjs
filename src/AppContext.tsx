import { Accessor, createContext, ParentComponent, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { UserInfo, LoginResponse, RenewTokenResponse } from "@/api";

const REFRESH_TOKEN_KEY: string = "token";

export type ToastKind = "success" | "error";
type ToastState = {
  open: boolean;
  message: string;
  kind: ToastKind;
};

type AppContextState = {
  user?: UserInfo;
  isLoggedIn: boolean;
  accessToken: string;
  refreshToken: string;
  expireAt: Date;
  toast: ToastState;
};

type AppContextValue = [
  state: AppContextState,
  actions: {
    signIn: (rsp: LoginResponse) => void;
    signOut: Accessor<void>;
    updateAuthUser: (user: UserInfo) => void;
    updateToken: (rsp: RenewTokenResponse) => void;
    setToast: (message: string, kind: ToastKind, open?: boolean) => void;
  },
];

const AppContext = createContext<AppContextValue>();

export const AppContextProvider: ParentComponent = (props) => {
  const [state, setState] = createStore<AppContextState>({
    isLoggedIn: false,
    accessToken: "",
    refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY) || "",
    expireAt: new Date(),
    toast: { open: false, message: "", kind: "success" },
  });

  const signIn = (rsp: LoginResponse) => {
    localStorage.setItem(REFRESH_TOKEN_KEY, rsp.refreshToken);
    setState({ isLoggedIn: true, ...rsp });
  };

  const signOut = () => {
    localStorage.setItem(REFRESH_TOKEN_KEY, "");
    setState({ isLoggedIn: false, user: undefined, accessToken: "", refreshToken: "" });
  };

  const updateAuthUser = (user: UserInfo) => {
    setState({ user: user });
  };

  const updateToken = (rsp: RenewTokenResponse) => {
    localStorage.setItem(REFRESH_TOKEN_KEY, rsp.refreshToken);
    setState({ ...rsp });
  };

  const setToast = (message: string, kind: ToastKind, open = true) => setState("toast", { message, kind, open });

  return <AppContext.Provider value={[state, { signIn, signOut, updateAuthUser, updateToken, setToast }]}>{props.children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
