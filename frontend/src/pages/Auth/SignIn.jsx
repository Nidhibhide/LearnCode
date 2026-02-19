import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import { getMe, signin } from "../../api/user";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
  InputField,
  Button,
  AuthImage,
} from "../../components/index";
import { useNavigate, useSearchParams } from "react-router-dom";
import { handleApiResponse, handleApiError } from "../../utils";
import { emailValidator, stringValidator, passwordValidator, selectValidator } from "../../validation/GlobalValidation";
import { FaUserGraduate, FaUserShield } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/features/userSlice";

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const message = searchParams.get("message");
  const status = searchParams.get("status");
  useEffect(() => {
    if (status === "success") {
      toast.success(message);
    }
  }, [status, message, navigate]);
  // handle sign in
  const handleSignIn = async (values, { resetForm }) => {
    try {
      if (loading) return;
      setLoading(true);
      const signinRes = await signin(values);
      const { status: signinStatus, message: signinMsg } =
        handleApiResponse(signinRes);

      if (signinStatus === 200) {
        //fetch user api
        const userRes = await getMe();
        const { statusCode: getMeStatus, data } = userRes;
        console.log(data);
        if (getMeStatus === 200) {
          dispatch(setUser(data));
        }

        const role = data?.role;
        const path =
          role === "admin"
            ? "/dashboard/adminDashboard"
            : "/dashboard/assessments";
        setTimeout(() => navigate(path), 3000);
      } else if (signinStatus === 400) {
        setTimeout(() => navigate("/resend-verify"), 3000);
      } else if (signinStatus === 403) {
        // Account blocked, redirect to forgot password
        setTimeout(() => navigate("/forgotPass"), 3000);
      }
      resetForm();
    } catch (err) {
      handleApiError(err, "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // validation schema - using validators directly from GlobalValidation
  const validationSchema = Yup.object({
    email: emailValidator("Email", true),
    password: passwordValidator("Password", 8, 12, true),
    role: selectValidator("Role", ["student", "admin"], false),
  });
  return (
    <div className="h-screen flex bg-white">
      <div className=" lg:w-[50%] w-full rounded-tl-2xl rounded-bl-2xl px-4  md:px-12 bg-white ">
        <div className=" h-full flex flex-col justify-center">
          <p className="font-extrabold text-3xl md:text-4xl md:mb-12 mb-4">
            LearnCode
          </p>
          <p className="font-semibold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mb-6 sm:mb-8 md:mb-12 lg:mb-14 px-4 md:px-0">
            Welcome to LearnCode! Please sign In to start your coding journey.
          </p>

          {/* form */}

          <Formik
            initialValues={{ email: "", password: "", role: "student" }}
            validationSchema={validationSchema}
            onSubmit={handleSignIn}
          >
            {({ handleSubmit }) => (
              <>
                <div className="flex flex-col space-y-4 mb-10">
                  <div className="flex flex-col space-y-1">
                    <InputField
                      label="Select Role"
                      name="role"
                      as="radio"
                      radioOptions={[
                        { value: "student", label: "Student", icon: <FaUserGraduate /> },
                        { value: "admin", label: "Admin", icon: <FaUserShield /> },
                      ]}
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <InputField
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="Enter your Email"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <InputField
                      label="Password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button width="w-full" loading={loading} onClick={handleSubmit}>
                    Sign In
                  </Button>
                  <Button width="w-full" onClick={() => navigate("/")}>
                    Home
                  </Button>
                </div>
                <p className="md:text-lg text-sm text-center md:text-left">
                  Forgot Password?{" "}
                  <Link
                    to="/forgotPass"
                    className="font-semibold text-blue hover:underline"
                  >
                    Click Here
                  </Link>
                </p>
              </>
            )}
          </Formik>
        </div>
      </div>
      <AuthImage />
    </div>
  );
};

export default SignIn;
