import { Accessor, createContext, ParentComponent, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { UserInfo, LoginResponse, AutoLoginResponse } from "@/api";

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
  toast: ToastState;
};

type AppContextValue = [
  state: AppContextState,
  actions: {
    signIn: (rsp: LoginResponse) => void;
    autoIn: (rsp: AutoLoginResponse) => void;
    signOut: Accessor<void>;
    updateState: (user?: UserInfo, accessToken?: string) => void;
    setToast: (message: string, kind: ToastKind, open?: boolean) => void;
  },
];

const AppContext = createContext<AppContextValue>();

export const AppContextProvider: ParentComponent = (props) => {
  const [state, setState] = createStore<AppContextState>({
    isLoggedIn: false,
    accessToken: "",
    refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY) || "",
    toast: { open: false, message: "", kind: "success" },
  });

  const signIn = (rsp: LoginResponse) => {
    localStorage.setItem(REFRESH_TOKEN_KEY, rsp.refreshToken);
    setState({ isLoggedIn: true, ...rsp });
  };

  const autoIn = (rsp: AutoLoginResponse) => {
    setState({ isLoggedIn: true, ...rsp });
  };

  const signOut = () => {
    localStorage.setItem(REFRESH_TOKEN_KEY, "");
    setState({ isLoggedIn: false, user: undefined, accessToken: "", refreshToken: "" });
  };

  const updateState = (user?: UserInfo, accessToken?: string) => {
    setState(
      produce((s) => {
        if (user) s.user = user;
        if (accessToken) s.accessToken = accessToken;
      }),
    );
  };

  const setToast = (message: string, kind: ToastKind, open = true) => setState("toast", { message, kind, open });

  return <AppContext.Provider value={[state, { signIn, autoIn, signOut, updateState, setToast }]}>{props.children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
