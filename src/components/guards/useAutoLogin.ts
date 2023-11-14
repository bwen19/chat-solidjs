import { createSignal, onMount } from "solid-js";
import { useAppContext } from "@/AppContext";
import { AutoLoginConfig } from "@/api";
import { useFetchAuth } from "@/utils/fetch";

const useAutoLogin = (is_admin: boolean) => {
  const [state, { signIn }] = useAppContext();
  const autoLogin = useFetchAuth(AutoLoginConfig);

  const [loading, setLoading] = createSignal(true);

  onMount(async () => {
    if (!state.isLoggedIn) {
      const rsp = await autoLogin({ is_admin });
      signIn(rsp.user, rsp.access_token);
    }
    setLoading(false);
  });

  return loading;
};

export default useAutoLogin;
