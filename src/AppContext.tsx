import { Accessor, createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { UserInfo, LoginResponse } from "@/api";

const AUTO_LOGIN_KEY: string = "isAutoLogin";

export type ToastKind = "success" | "error";
type ToastState = {
  open: boolean;
  message: string;
  kind: ToastKind;
};

type AppContextState = {
  isLoggedIn: boolean;
  isAutoLogin: boolean;
  user?: UserInfo;
  token: string;
  toast: ToastState;
};

type AppContextValue = [
  state: AppContextState,
  actions: {
    setAuth: (resp: LoginResponse) => void;
    setUser: (user: UserInfo) => void;
    setToken: (token: string) => void;
    clearAuth: Accessor<void>;
    toggleAutoLogin: Accessor<void>;
    setToast: (message: string, kind: ToastKind, open?: boolean) => void;
  }
];

const AppContext = createContext<AppContextValue>();

export const AppContextProvider: ParentComponent = (props) => {
  const [state, setState] = createStore<AppContextState>({
    isLoggedIn: false,
    isAutoLogin: localStorage.getItem(AUTO_LOGIN_KEY) === "true" ? true : false,
    token: "",
    toast: { open: false, message: "", kind: "success" },
  });

  const setAuth = (resp: LoginResponse) => {
    setState({ isLoggedIn: true, user: resp.user, token: resp.access_token });
  };
  const setUser = (user: UserInfo) => setState("user", user);
  const setToken = (token: string) => setState("token", token);
  const clearAuth = () => {
    localStorage.setItem(AUTO_LOGIN_KEY, "false");
    setState({ isLoggedIn: false, isAutoLogin: false, user: undefined, token: "" });
  };

  const toggleAutoLogin = () => {
    localStorage.setItem(AUTO_LOGIN_KEY, state.isAutoLogin ? "false" : "true");
    setState("isAutoLogin", (value) => !value);
  };

  const setToast = (message: string, kind: ToastKind, open = true) => setState("toast", { message, kind, open });

  return <AppContext.Provider value={[state, { setAuth, setUser, setToken, clearAuth, toggleAutoLogin, setToast }]}>{props.children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
