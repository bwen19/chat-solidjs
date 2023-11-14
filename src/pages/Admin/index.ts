import { lazy } from "solid-js";
import { Navigate, RouteDefinition } from "@solidjs/router";
import AdminGuard from "@/components/guards/AdminGuard";

export const adminRoutes: RouteDefinition[] = [
  {
    path: "/login",
    component: lazy(() => import("./Login")),
  },
  {
    path: "/",
    component: AdminGuard,
    children: {
      path: "/",
      component: lazy(() => import("./Admin")),
      children: [
        {
          path: "/",
          component: () => Navigate({ href: "/admin/dashboard" }),
        },
        {
          path: "/dashboard",
          component: lazy(() => import("@/components/Dashboard")),
        },
        {
          path: "/users",
          component: lazy(() => import("@/components/Users")),
        },
      ],
    },
  },
];
