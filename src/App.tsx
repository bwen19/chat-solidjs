import type { Component } from "solid-js";
import { Router, useRoutes } from "@solidjs/router";
import { AppContextProvider } from "./AppContext";
import { Toast } from "./components/common";
import { routes } from "./pages";

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
