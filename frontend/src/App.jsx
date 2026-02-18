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
import SessionExpired from "./SessionExpired";
import {
  ViewTest,
  Setting,
  Logout,
  RestoreTest,
  Assessments,
  MyScores,
  Notification,
  UserAttempts,
  AdminDashboard,
} from "./pages/Dashboard/index";
import {
  EditTest,
  DeleteTest,
  Preview,
  CreateTest,
} from "./pages/Dashboard/ViewTest/index";
import {
  ChangePassword,
  EditProfile,
} from "./pages/Dashboard/Setting/index";
import {
  QuestionsList,
  TestLayout,
  Rules,
} from "./pages/Dashboard/Assessments/index";
import { DashboardPage } from "./pages/Dashboard";
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
          <Route path="/session-expired" element={<SessionExpired />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/forgotPass" element={<ForgotPassword />} />
          <Route path="/resetPass" element={<ResetPassword />} />
          <Route path="/verify" element={<Verification />} />
          <Route path="/resend-verify" element={<ResendVerification />} />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <RoleAuth allowedRoles={["admin", "student"]}>
                <DashboardPage />
              </RoleAuth>
            }
          >
            <Route
              path="viewTest"
              element={
                <RoleAuth allowedRoles={["admin"]}>
                  <ViewTest />
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
                path="editTest/:testId"
                element={
                  <RoleAuth allowedRoles={["admin"]}>
                    <EditTest />
                  </RoleAuth>
                }
              />
              <Route
                path="deleteTest/:testId"
                element={
                  <RoleAuth allowedRoles={["admin"]}>
                    <DeleteTest />
                  </RoleAuth>
                }
              />
            </Route>
            <Route
              path="restoreTest"
              element={
                <RoleAuth allowedRoles={["admin"]}>
                  <RestoreTest />
                </RoleAuth>
              }
            />
            <Route
              path="assessments"
              element={
                <RoleAuth allowedRoles={["student"]}>
                  <Assessments />
                </RoleAuth>
              }
            />
            <Route
              path="questionsList"
              element={
                <RoleAuth allowedRoles={["student"]}>
                  <QuestionsList />
                </RoleAuth>
              }
            />
            <Route
              path="rules"
              element={
                <RoleAuth allowedRoles={["student"]}>
                  <Rules />
                </RoleAuth>
              }
            />
            <Route
              path="TestLayout"
              element={
                <RoleAuth allowedRoles={["student"]}>
                  <TestLayout />
                </RoleAuth>
              }
            />
            {/* </Route> */}
            <Route
              path="myScores"
              element={
                <RoleAuth allowedRoles={["student"]}>
                  <MyScores />
                </RoleAuth>
              }
            />
            <Route
              path="preview"
              element={
                <RoleAuth allowedRoles={["admin", "student"]}>
                  <Preview />
                </RoleAuth>
              }
            />
            <Route
              path="notifications"
              element={
                <RoleAuth allowedRoles={["admin", "student"]}>
                  <Notification />
                </RoleAuth>
              }
            />
            <Route
              path="userAttempts"
              element={
                <RoleAuth allowedRoles={["admin"]}>
                  <UserAttempts />
                </RoleAuth>
              }
            ></Route>
            <Route
              path="adminDashboard"
              element={
                <RoleAuth allowedRoles={["admin"]}>
                  <AdminDashboard />
                </RoleAuth>
              }
            />
            <Route
              path="setting"
              element={
                <RoleAuth allowedRoles={["admin", "student"]}>
                  <Setting />
                </RoleAuth>
              }
            >
              <Route
                path="changePassword"
                element={
                  <RoleAuth allowedRoles={["admin", "student"]}>
                    <ChangePassword />
                  </RoleAuth>
                }
              />
              <Route
                path="editProfile"
                element={
                  <RoleAuth allowedRoles={["admin", "student"]}>
                    <EditProfile />
                  </RoleAuth>
                }
              />
            </Route>
            <Route
              path="logout"
              element={
                <RoleAuth allowedRoles={["admin", "student"]}>
                  <Logout />
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
