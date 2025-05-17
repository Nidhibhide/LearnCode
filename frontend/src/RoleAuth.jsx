import { Navigate } from "react-router-dom";

const RoleAuth = ({ allowedRoles, children }) => {
  const role = JSON.parse(localStorage.getItem("data")).role;

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorize" />;
  }
  return children;
};

export default RoleAuth;
