import { Component, Show } from "solid-js";
import { Navigate, Outlet } from "@solidjs/router";
import { useAppContext } from "@/AppContext";
import useAutoLogin from "@/utils/useAutoLogin";

const AdminGuard: Component = () => {
  const loading = useAutoLogin(true);

  return (
    <Show when={loading()} fallback={<RequireAdmin />}>
      <div class="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 transform">
        <div class="h-20 w-20 animate-spin rounded-full border-8 border-solid border-blue-400 border-t-transparent"></div>
      </div>
    </Show>
  );
};

const RequireAdmin: Component = () => {
  const [state] = useAppContext();

  return (
    <Show when={state.isLoggedIn && state.user?.role === "admin"} fallback={<Navigate href="/admin/login" />}>
      <Outlet />
    </Show>
  );
};

export default AdminGuard;
