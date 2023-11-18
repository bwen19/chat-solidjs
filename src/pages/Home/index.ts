import { lazy } from "solid-js";
import { RouteDefinition } from "@solidjs/router";
import HomeGuard from "./HomeGuard";

export const homeRoutes: RouteDefinition[] = [
  {
    path: "/login",
    component: lazy(() => import("./Login")),
  },
  {
    path: "/",
    component: HomeGuard,
    children: {
      path: "/",
      component: lazy(() => import("./Home")),
    },
  },
];
