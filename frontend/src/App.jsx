import RoleAuth from "./RoleAuth";
import {
  SignIn,
  SignUp,
  ForgotPassword,
  ResetPassword,
  Verification,
  ResendVerification,
} from "./pages/Auth/index";
import Unauthorized from "./Unauthorized";
import {
  CreateTest,
  ViewTest,
} from "./pages/Dashboard/Components/Content/index";
import { Dashboard } from "./pages/dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/unauthorize" element={<Unauthorized />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/forgotPass" element={<ForgotPassword />} />
          <Route path="/resetPass" element={<ResetPassword />} />
          <Route path="/verify" element={<Verification />} />
          <Route path="/resend-verify" element={<ResendVerification />} />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <RoleAuth allowedRoles={["admin"]}>
                <Dashboard />
              </RoleAuth>
            }
          >
            <Route
              path="createTest"
              element={
                <RoleAuth allowedRoles={["admin"]}>
                  <CreateTest />
                </RoleAuth>
              }
            />
            <Route
              path="viewTest"
              element={
                <RoleAuth allowedRoles={["admin"]}>
                  <ViewTest />
                </RoleAuth>
              }
            />
          </Route>
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
