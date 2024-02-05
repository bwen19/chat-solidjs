import { JSX, createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { useNavigate } from "@solidjs/router";
import { useAppContext } from "@/AppContext";
import { ApiConfig, AutoLoginConfig, LoginConfig, LogoutConfig } from "@/api";
import { handleResponse } from "./handleResponse";

export const useAuthFetch = <T, P>(config: ApiConfig<T, P>) => {
  const sendAuthRequest = async (param: P): Promise<T> => {
    try {
      const rsp = await fetch(config.url, {
        method: config.method,
        headers: { "Content-Type": "application/json" },
        body: param && JSON.stringify(param),
      });
      return handleResponse<T>(rsp);
    } catch (e) {
      throw new Error("Something went wrong");
    }
  };
  return sendAuthRequest;
};

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

      signIn(rsp);

      if (isAdmin) navigate("/admin/dashboard");
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
    } else if (state.isLoggedIn || state.refreshToken) {
      if (isAdmin) navigate("/admin/dashboard");
      else navigate("/");
    }
  });

  return { loading, handleSubmit, setFields };
};

export const useAutoLogin = (isAdmin: boolean) => {
  const [state, { signIn, signOut, setToast }] = useAppContext();
  const autoLogin = useAuthFetch(AutoLoginConfig);

  const [loading, setLoading] = createSignal(true);

  onMount(async () => {
    if (state.refreshToken && !state.isLoggedIn) {
      try {
        const rsp = await autoLogin({ isAdmin, refreshToken: state.refreshToken });
        signIn(rsp);
      } catch (err) {
        setToast("身份认证已失效，请重新登录", "error");
        signOut();
      }
    }
    setLoading(false);
  });

  return loading;
};

export const useLogout = (clean = true) => {
  const [state, { setToast, signOut }] = useAppContext();
  const logout = useAuthFetch(LogoutConfig);

  const [loading, setLoading] = createSignal(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout({ refreshToken: state.refreshToken });
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
