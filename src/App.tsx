import type { ParentComponent } from "solid-js";
import { AppContextProvider } from "./AppContext";
import { Toast } from "./components/common";

const App: ParentComponent = (props) => {
  return (
    <AppContextProvider>
      <Toast />
      {props.children}
    </AppContextProvider>
  );
};

export default App;
