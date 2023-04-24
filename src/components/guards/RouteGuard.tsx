import { Component, Show } from "solid-js";
import { Navigate, Outlet } from "@solidjs/router";
import { useAppContext } from "@/AppContext";
import useAutoLogin from "./useAutoLogin";

const RouteGuard: Component = () => {
  const [state] = useAppContext();
  const loading = useAutoLogin();

  return (
    <Show
      when={loading()}
      fallback={
        <Show when={state.isLoggedIn} fallback={<Navigate href="/login" />}>
          <Outlet />
        </Show>
      }
    >
      <div class="absolute right-1/2 bottom-1/2 translate-x-1/2 translate-y-1/2 transform">
        <div class="h-20 w-20 animate-spin rounded-full border-8 border-solid border-blue-400 border-t-transparent"></div>
      </div>
    </Show>
  );
};

export default RouteGuard;
