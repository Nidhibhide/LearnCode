import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { InputField, Button, AuthImage } from "../../components/index";
import { Formik } from "formik";
import { signup, signinwithGoogle, getMe } from "../../api/user";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { handleApiResponse, handleApiError } from "../../utils";
const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // handle sign up
  const handleSignUp = async (values, { resetForm }) => {
    try {
      if (loading) return;
      setLoading(true);
      const response = await signup(values);
      const { status, message } = handleApiResponse(response);

      if (status === 200) {
        setTimeout(() => navigate("/login"), 3000);
      }
      resetForm();
    } catch (err) {
      handleApiError(err, "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  //handle sign in with google
  const handleGoogleLogin = async (values) => {
    try {
      const token = values?.credential;

      const res = await signinwithGoogle(token);
      const { status: signinStatus } = handleApiResponse(res);

      if (signinStatus === 200) {
        //fetch user api
        const userRes = await getMe();
        const { statusCode: getMeStatus, data } = userRes;
        if (getMeStatus === 200) {
          localStorage.setItem("data", JSON.stringify(data));
        }
        const role = data?.role;
        const path =
          role === "admin" ? "/dashboard/viewTest" : "/dashboard/assessments";
        setTimeout(() => navigate(path), 3000);
      }
    } catch (err) {
      handleApiError(err, "Sign in with google failed");
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "Only alphabets and spaces are allowed")
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name should not exceed 50 characters")
      .required("Name is required"),

    email: Yup.string().email("Invalid email").required("Email is required"),

    password: Yup.string()
      .matches(/^\d+$/, "Password must contain digits only")
      .min(5, "Password must be at least 5 characters")
      .max(10, "Password must not exceed 10 characters")
      .required("Password is required"),
  });

  return (
    <div className="h-screen flex bg-white">
      <div className="lg:w-[50%] w-full rounded-tl-2xl rounded-bl-2xl px-4 md:px-12 bg-white">
        <div className="h-full flex flex-col justify-center">
          <p className="font-extrabold text-3xl md:text-4xl md:mb-12 mb-4">
            LearnCode
          </p>
          <p className="font-semibold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl md:mb-12 lg:mb-14 mb-6 sm:mb-8 px-4 md:px-0">
            Welcome to LearnCode! Please sign up to start your coding journey.
          </p>

          <div className="mb-8 flex justify-center px-4">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => toast.error("Google Login Failed")}
              theme="filled_blue"
              size="large"
              text="continue_with"
              width="270"
            />
          </div>

          <div className="flex items-center mb-6">
            <div className=" flex-1 border-t border-light-gray-border"></div>
            <span className="mx-4 text-medium-gray font-semibold">OR</span>
            <div className=" flex-1 border-t border-light-gray-border"></div>
          </div>
          <Formik
            initialValues={{ name: "", email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSignUp}
          >
            {({ handleSubmit }) => (
              <>
                <div className="flex flex-col space-y-4 mb-12">
                  <div className="flex flex-col space-y-1">
                    <InputField
                      label="Name"
                      name="name"
                      type="text"
                      placeholder="Enter your name"
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
                <Button
                  loading={loading}
                  onClick={handleSubmit}
                >
                  Create Account
                </Button>
              </>
            )}
          </Formik>

          <p className="md:text-lg text-sm text-center md:text-left">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue hover:underline"
            >
              Login Here
            </Link>
          </p>
        </div>
      </div>

      <AuthImage />
    </div>
  );
};

export default SignUp;
