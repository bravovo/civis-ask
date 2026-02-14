import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RoleCheck = ({ roles, children }) => {
    const { user, authChecked, token } = useSelector((state) => state.auth);

    if (token && !authChecked) {
        return null;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!roles.includes(user.role)) {
        return <Navigate to="/403" replace />;
    }

    return children;
};

export default RoleCheck;
