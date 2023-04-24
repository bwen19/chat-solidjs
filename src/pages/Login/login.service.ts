import { createSignal, JSX } from "solid-js";
import { createStore } from "solid-js/store";
import { useNavigate } from "@solidjs/router";
import { useAppContext } from "@/AppContext";
import { LoginConfig } from "@/api";
import { useFetchAuth } from "@/utils/fetch";

export const useLogin = (is_admin?: boolean) => {
  const [state, { setAuth, setToast }] = useAppContext();
  const navigate = useNavigate();
  const login = useFetchAuth(LoginConfig);

  const [loading, setLoading] = createSignal(false);
  const [fields, setFields] = createStore({ username: "", password: "" });

  const handleSubmit: JSX.EventHandler<HTMLFormElement, Event> = async (ev) => {
    ev.preventDefault();
    if (!fields.username || !fields.password) return;

    setLoading(true);
    try {
      const resp = await login({
        username: fields.username,
        password: fields.password,
        is_admin,
        is_persisted: state.isAutoLogin,
      });
      setAuth(resp);
      if (is_admin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      if (err instanceof Error && err.message) {
        setToast(err.message, "error");
      }
    }
    setLoading(false);
  };

  return { loading, handleSubmit, setFields };
};
