import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { checkToken, refreshToken, getMe } from "../api/user";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/features/userSlice";

const getDashboardPath = (role) => {
  if (role === "admin") return "/dashboard/adminDashboard";
  if (role === "student") return "/dashboard/assessments";
  return null;
};

const GuestOnly = ({ children }) => {
  const [status, setStatus] = useState("loading"); // loading | guest | redirect
  const [redirectTo, setRedirectTo] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    let cancelled = false;

    const resolveSession = async () => {
      try {
        let tokenRes = await checkToken();

        if (tokenRes?.statusCode !== 200) {
          const refreshRes = await refreshToken();
          if (refreshRes?.statusCode === 200) {
            tokenRes = await checkToken();
          }
        }

        if (cancelled) return;

        if (tokenRes?.statusCode === 200) {
          const userRes = await getMe();
          if (cancelled) return;

          if (userRes?.statusCode === 200 && userRes?.data) {
            dispatch(setUser(userRes.data));
            const path = getDashboardPath(userRes.data.role);
            if (path) {
              setRedirectTo(path);
              setStatus("redirect");
              return;
            }
          }
        }

        setStatus("guest");
      } catch {
        if (!cancelled) setStatus("guest");
      }
    };

    resolveSession();
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  if (status === "loading") return null;
  if (status === "redirect" && redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default GuestOnly;
