import { createSignal, JSX } from "solid-js";
import { createStore } from "solid-js/store";
import { useNavigate } from "@solidjs/router";
import { RegisterConfig } from "@/api";
import { useAppContext } from "@/AppContext";
import { useFetchAuth } from "@/utils/fetch";

export const useRegister = () => {
  const [_, { setToast }] = useAppContext();
  const register = useFetchAuth(RegisterConfig);
  const navigate = useNavigate();

  const [loading, setLoading] = createSignal(false);
  const [fields, setFields] = createStore({ username: "", password: "", code: "" });

  const handleSubmit: JSX.EventHandler<HTMLFormElement, Event> = async (ev) => {
    ev.preventDefault();
    if (!fields.username || !fields.password || !fields.code) return;

    setLoading(true);
    try {
      const resp = await register({
        username: fields.username,
        password: fields.password,
        code: fields.code,
      });
      setToast(`Registration successful! ${resp.user.username}`, "success");
      navigate("/login");
    } catch (err) {
      if (err instanceof Error && err.message) {
        setToast(err.message, "error");
      }
    }
    setLoading(false);
  };

  return { loading, setFields, handleSubmit };
};
