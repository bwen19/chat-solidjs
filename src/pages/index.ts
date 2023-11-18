import { lazy } from "solid-js";
import type { RouteDefinition } from "@solidjs/router";
import { homeRoutes } from "./Home";
import { adminRoutes } from "./Admin";

export const routes: RouteDefinition[] = [
  {
    path: "/",
    children: homeRoutes,
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
