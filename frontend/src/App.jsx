import {
  SignIn,
  SignUp,
  ForgotPassword,
  ResetPassword,
  Verification,
  ResendVerification,
} from "./pages/Auth/index";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/forgotPass" element={<ForgotPassword />} />
          <Route path="/resetPass" element={<ResetPassword />} />
          <Route path="/verify" element={<Verification />} />

          <Route path="/resend-verify" element={<ResendVerification />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
