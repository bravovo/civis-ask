import { BrowserRouter } from "react-router-dom";
import Router from "./router/Router";
import "./App.css";
import { Provider } from "react-redux";
import { store } from "./state/store";

function App() {
    return (
        <BrowserRouter>
            <Provider store={store}>
                <Router />
            </Provider>
        </BrowserRouter>
    );
}

export default App;
