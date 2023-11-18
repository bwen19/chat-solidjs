import { Accessor, createContext, ParentComponent, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { UserInfo } from "@/api";

const PERSIST_KEY: string = "persist";

export type ToastKind = "success" | "error";
type ToastState = {
  open: boolean;
  message: string;
  kind: ToastKind;
};

type AppContextState = {
  user?: UserInfo;
  persist: boolean;
  isLoggedIn: boolean;
  token: string;
  toast: ToastState;
};

type AppContextValue = [
  state: AppContextState,
  actions: {
    signIn: (user: UserInfo, token: string) => void;
    signOut: Accessor<void>;
    updateState: (user?: UserInfo, token?: string) => void;
    setToast: (message: string, kind: ToastKind, open?: boolean) => void;
  },
];

const AppContext = createContext<AppContextValue>();

export const AppContextProvider: ParentComponent = (props) => {
  const [state, setState] = createStore<AppContextState>({
    persist: localStorage.getItem(PERSIST_KEY) === "true" ? true : false,
    isLoggedIn: false,
    token: "",
    toast: { open: false, message: "", kind: "success" },
  });

  const signIn = (user: UserInfo, token: string) => {
    localStorage.setItem(PERSIST_KEY, "true");
    setState({ persist: true, isLoggedIn: true, user, token });
  };

  const signOut = () => {
    localStorage.setItem(PERSIST_KEY, "false");
    setState({ persist: false, isLoggedIn: false, user: undefined, token: "" });
  };

  const updateState = (user?: UserInfo, token?: string) => {
    setState(
      produce((s) => {
        if (user) s.user = user;
        if (token) s.token = token;
      }),
    );
  };

  const setToast = (message: string, kind: ToastKind, open = true) => setState("toast", { message, kind, open });

  return <AppContext.Provider value={[state, { signIn, signOut, updateState, setToast }]}>{props.children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
