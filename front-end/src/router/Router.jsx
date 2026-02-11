import { Routes, Route } from "react-router-dom";
import Register from "../pages/register/Register";
import Login from "../pages/login/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Err403 from "../pages/error/403";
import RoleCheck from "../components/RoleCheck/RoleCheck";
import Err404 from "../pages/error/404";

function Router() {
    return (
        <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
                path="/dashboard"
                element={
                    <RoleCheck roles={["editor", "admin"]}>
                        <Dashboard />{" "}
                    </RoleCheck>
                }
            />
            <Route path="/403" element={<Err403 />} />
            <Route path="*" element={<Err404 />} />
        </Routes>
    );
}

export default Router;
