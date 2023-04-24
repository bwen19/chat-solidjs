import { createSignal, onMount } from "solid-js";
import { useAppContext } from "@/AppContext";
import { AutoLoginConfig } from "@/api";
import { useFetchAuth } from "@/utils/fetch";

const useAutoLogin = (is_admin?: boolean) => {
  const [state, { setAuth, toggleAutoLogin }] = useAppContext();
  const autoLogin = useFetchAuth(AutoLoginConfig);

  const [loading, setLoading] = createSignal(true);

  onMount(async () => {
    if (!state.isLoggedIn && state.isAutoLogin) {
      try {
        const resp = await autoLogin({ is_admin });
        setAuth(resp);
      } catch (err) {
        toggleAutoLogin();
      }
    }
    setLoading(false);
  });

  return loading;
};

export default useAutoLogin;
