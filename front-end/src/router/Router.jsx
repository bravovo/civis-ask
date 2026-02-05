import { Routes, Route } from "react-router-dom";
import Register from "../pages/register/Register";
import Login from "../pages/login/Login";

function Router() {
    return (
        <Routes>
            <Route path="/register" element={<Register />} />
            <Route index path="/login" element={<Login />} />
        </Routes>
    );
}

export default Router;
