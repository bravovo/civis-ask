import { Routes, Route } from "react-router-dom";
import Register from "../pages/register/Register";
import Login from "../pages/login/Login";
import Dashboard from "../pages/dashboard/Dashboard";

function Router() {
    return (
        <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    );
}

export default Router;
