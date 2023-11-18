import { createSignal } from "solid-js";
import { useAppContext } from "@/AppContext";
import { LogoutConfig } from "@/api";
import { useFetchAuth } from "./fetch";

export const useLogout = (clean = true) => {
  const [_, { setToast, signOut }] = useAppContext();
  const logout = useFetchAuth(LogoutConfig);

  const [loading, setLoading] = createSignal(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } catch (err) {
      if (err instanceof Error) {
        if (err.message) setToast(err.message, "error");
      }
    } finally {
      if (clean) signOut();
    }
    setLoading(false);
  };

  return { loading, handleLogout };
};
