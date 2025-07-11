import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { checkToken, refreshToken } from "./api/user";

const RoleAuth = ({ allowedRoles, children }) => {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const validateToken = async () => {
      try {
        const res = await checkToken();
        const { statusCode } = res;
        if (statusCode === 200) {
          const role = JSON.parse(localStorage.getItem("data"))?.role;
          if (!role || !allowedRoles.includes(role)) {
            setStatus("unauthorized");
          } else {
            setStatus("authorized");
          }
        } else {
          const res = await refreshToken();
          const { statusCode } = res;
          if (statusCode === 200) {
            await validateToken();
          } else {
            setStatus("expired");
          }
        }
      } catch (err) {
        setStatus("expired");
      }
    };

    validateToken();
  }, [allowedRoles]);

  // Redirect logic
  if (status === "loading") return null;
  if (status === "expired") return <Navigate to="/session-expired" />;
  if (status === "unauthorized") return <Navigate to="/unauthorize" />;

  return children;
};

export default RoleAuth;
