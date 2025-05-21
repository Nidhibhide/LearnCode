// import { Navigate } from "react-router-dom";
// import { checkToken } from "./api/user";

// const RoleAuth = async ({ allowedRoles, children }) => {
//   //here check token and redirect to session expired page
//   const res = await checkToken();
//   console.log(res);
//   if (res?.status === 401) {
//     return <Navigate to="/session-expired" />;
//   }
//   if (res?.status === 200) {
//     const role = JSON.parse(localStorage.getItem("data"))?.role;

//     if (!role || !allowedRoles.includes(role)) {
//       return <Navigate to="/unauthorize" />;
//     }

//   return children;
//   }
// };

// export default RoleAuth;
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { checkToken } from "./api/user"; // Make sure this returns a Promise

const RoleAuth = ({ allowedRoles, children }) => {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const validateToken = async () => {
      try {
        const res = await checkToken();

        if (res?.status === 200) {
          const role = JSON.parse(localStorage.getItem("data"))?.role;
          if (!role || !allowedRoles.includes(role)) {
            setStatus("unauthorized");
          } else {
            setStatus("authorized");
          }
        } else {
          setStatus("expired");
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
