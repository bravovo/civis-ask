import { BrowserRouter } from "react-router-dom";
import Router from "./router/Router";
import "./App.css";
import { Provider } from "react-redux";
import { store } from "./state/store";
import AuthProvider from "./features/auth/AuthProvider";
import { setupAxios } from "./api/api";
import { TooltipProvider } from "@/components/ui/tooltip";

let axiosConfigured = false;

if (!axiosConfigured) {
  setupAxios(store);
  axiosConfigured = true;
}

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <AuthProvider>
          <TooltipProvider>
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
