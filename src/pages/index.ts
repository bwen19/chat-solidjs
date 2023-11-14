import { lazy } from "solid-js";
import type { RouteDefinition } from "@solidjs/router";
import RouteGuard from "@/components/guards/RouteGuard";
import { adminRoutes } from "./Admin";

export const routes: RouteDefinition[] = [
  {
    path: "/",
    component: RouteGuard,
    children: {
      path: "/",
      component: lazy(() => import("./Home")),
    },
  },
  {
    path: "/login",
    component: lazy(() => import("./Login")),
  },
  {
    path: "/admin",
    children: adminRoutes,
  },
  {
    path: "**",
    component: lazy(() => import("./NotFound")),
  },
];
