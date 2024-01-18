import { createSignal, onMount } from "solid-js";
import { useAppContext } from "@/AppContext";
import { AutoLoginConfig } from "@/api";
import useAuthFetch from "./useAuthFetch";

const useAutoLogin = (isAdmin: boolean) => {
  const [state, { autoIn, signOut, setToast }] = useAppContext();
  const autoLogin = useAuthFetch(AutoLoginConfig);

  const [loading, setLoading] = createSignal(true);

  onMount(async () => {
    if (state.refreshToken && !state.isLoggedIn) {
      try {
        const rsp = await autoLogin({ isAdmin });
        autoIn(rsp);
      } catch (err) {
        setToast("身份认证已失效，请重新登录", "error");
        signOut();
      }
    }
    setLoading(false);
  });

  return loading;
};

export default useAutoLogin;
