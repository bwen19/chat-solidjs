import { createSignal } from "solid-js";
import { useAppContext } from "@/AppContext";
import { LogoutConfig } from "@/api";
import { useFetchAuth } from "@/utils/fetch";

export const useLogout = (clean = true) => {
  const [_, { setToast, clearAuth }] = useAppContext();
  const [loading, setLoading] = createSignal(false);
  const logout = useFetchAuth(LogoutConfig);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } catch (err) {
      if (err instanceof Error) {
        if (err.message) setToast(err.message, "error");
      }
    } finally {
      if (clean) clearAuth();
    }
    setLoading(false);
  };

  return { loading, handleLogout };
};
