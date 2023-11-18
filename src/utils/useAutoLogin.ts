import { createSignal, onMount } from "solid-js";
import { useAppContext } from "@/AppContext";
import { AutoLoginConfig } from "@/api";
import { useFetchAuth } from "./fetch";

const useAutoLogin = (isAdmin: boolean) => {
  const [state, { signIn, signOut, setToast }] = useAppContext();
  const autoLogin = useFetchAuth(AutoLoginConfig);

  const [loading, setLoading] = createSignal(true);

  onMount(async () => {
    if (state.persist && !state.isLoggedIn) {
      try {
        const rsp = await autoLogin({ isAdmin });
        signIn(rsp.user, rsp.accessToken);
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
