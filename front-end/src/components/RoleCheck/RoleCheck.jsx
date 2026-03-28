import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RoleCheck = ({ roles, children }) => {
  const { email, authChecked, token, role } = useSelector(
    (state) => state.profile
  );

  if (token && !authChecked) {
    return null;
  }

  if (authChecked && !email) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(role)) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default RoleCheck;
