import { BrowserRouter } from "react-router-dom";
import Router from "./router/Router";
import "./App.css";
import { Provider } from "react-redux";
import { store } from "./state/store";
import AuthProvider from "./features/auth/AuthProvider";
import { setupAxios } from "./api/api";

setupAxios(store);

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
