import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RoleCheck = ({ roles, children }) => {
  const { email, authChecked, token, role } = useSelector(
    (state) => state.profile
  );

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!authChecked) {
    return null;
  }

  if (!email) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default RoleCheck;
