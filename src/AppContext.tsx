import { Accessor, createContext, ParentComponent, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { UserInfo } from "@/api";

export type ToastKind = "success" | "error";
type ToastState = {
  open: boolean;
  message: string;
  kind: ToastKind;
};

type AppContextState = {
  user?: UserInfo;
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
    isLoggedIn: false,
    token: "",
    toast: { open: false, message: "", kind: "success" },
  });

  const signIn = (user: UserInfo, token: string) => {
    setState({ isLoggedIn: true, user, token });
  };

  const signOut = () => {
    setState({ isLoggedIn: false, user: undefined, token: "" });
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
