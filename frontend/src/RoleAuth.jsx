import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { checkToken, refreshToken, getMe } from "./api/user";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "./redux/features/userSlice";

const RoleAuth = ({ allowedRoles, children }) => {
  const [status, setStatus] = useState("loading");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const role = user?.role;

  useEffect(() => {
    const validateToken = async () => {
      try {
        const res = await checkToken();
        const { statusCode } = res;
        if (statusCode === 200) {
          // If Redux doesn't have user data, fetch it
          let currentRole = role;
          if (!currentRole) {
            const userRes = await getMe();
            if (userRes.statusCode === 200) {
              dispatch(setUser(userRes.data));
              currentRole = userRes.data?.role;
            }
          }
          if (!currentRole || !allowedRoles.includes(currentRole)) {
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
  }, [allowedRoles, role, dispatch]);

  // Redirect logic
  if (status === "loading") return null;
  if (status === "expired") return <Navigate to="/session-expired" />;
  if (status === "unauthorized") return <Navigate to="/unauthorize" />;

  return children;
};

export default RoleAuth;
