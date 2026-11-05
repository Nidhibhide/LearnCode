import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { checkToken, refreshToken, getMe } from "./api/user";
import { useDispatch } from "react-redux";
import { setUser } from "./redux/features/userSlice";

const RoleAuth = ({ allowedRoles, children }) => {
  const [status, setStatus] = useState("loading");
  const dispatch = useDispatch();

  useEffect(() => {
    let cancelled = false;

    const validateToken = async (hasRefreshed = false) => {
      try {
        const tokenRes = await checkToken();
        if (cancelled) return;

        if (tokenRes?.statusCode === 200) {
          const userRes = await getMe();
          if (cancelled) return;

          let currentRole = null;
          if (userRes?.statusCode === 200 && userRes?.data) {
            dispatch(setUser(userRes.data));
            currentRole = userRes.data?.role;
          }

          if (!currentRole || !allowedRoles.includes(currentRole)) {
            setStatus("unauthorized");
          } else {
            setStatus("authorized");
          }
          return;
        }

        // Access token invalid — try refresh once only (avoid recursive loops)
        if (!hasRefreshed) {
          const refreshRes = await refreshToken();
          if (cancelled) return;

          if (refreshRes?.statusCode === 200) {
            await validateToken(true);
            return;
          }
        }

        // Refresh missing/invalid, or still unauthorized after refresh
        setStatus("expired");
      } catch (err) {
        if (!cancelled) setStatus("expired");
      }
    };

    validateToken();
    return () => {
      cancelled = true;
    };
  }, [allowedRoles, dispatch]);

  if (status === "loading") return null;
  if (status === "expired") return <Navigate to="/session-expired" />;
  if (status === "unauthorized") return <Navigate to="/unauthorize" />;

  return children;
};

export default RoleAuth;
