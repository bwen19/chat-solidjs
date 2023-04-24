import type { Component } from "solid-js";
import { Router, useRoutes } from "@solidjs/router";
import { AppContextProvider } from "./AppContext";
import { routes } from "./pages";
import { Toast } from "./components/common";

const App: Component = () => {
  const Routes = useRoutes(routes);

  return (
    <Router>
      <AppContextProvider>
        <Toast />
        <Routes />
      </AppContextProvider>
    </Router>
  );
};

export default App;
