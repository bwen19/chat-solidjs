import { createSignal, JSX, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { useNavigate } from "@solidjs/router";
import { useAppContext } from "@/AppContext";
import { LoginConfig } from "@/api";
import useAuthFetch from "./useAuthFetch";

export const useLogin = (isAdmin: boolean) => {
  const [state, { signIn, signOut, setToast }] = useAppContext();
  const navigate = useNavigate();
  const login = useAuthFetch(LoginConfig);

  const [loading, setLoading] = createSignal(false);
  const [fields, setFields] = createStore({ username: "", password: "" });

  const handleSubmit: JSX.EventHandler<HTMLFormElement, Event> = async (ev) => {
    ev.preventDefault();
    if (!fields.username || !fields.password) return;

    setLoading(true);
    try {
      const rsp = await login({
        username: fields.username,
        password: fields.password,
        isAdmin: isAdmin,
      });

      signIn(rsp.user, rsp.accessToken);

      if (isAdmin) navigate("/admin");
      else navigate("/");
    } catch (err) {
      if (err instanceof Error && err.message) {
        setToast(err.message, "error");
      }
    }
    setLoading(false);
  };

  onMount(() => {
    if (isAdmin && state.isLoggedIn && state.user?.role === "user") {
      signOut();
    } else if (state.isLoggedIn || state.persist) {
      if (isAdmin) navigate("/admin");
      else navigate("/");
    }
  });

  return { loading, handleSubmit, setFields };
};
