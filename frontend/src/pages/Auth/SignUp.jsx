import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { InputField } from "../../components/index";
import { Formik } from "formik";
import { codingImage } from "../../images/index";
import { signup, signinwithGoogle, getMe } from "../../api/user";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { socket } from "../../globals";
const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // handle sign up
  const handleSignUp = async (values, { resetForm }) => {
    try {
      if (loading) return;
      setLoading(true);
      const response = await signup(values);
      const { message, statusCode } = response;

      if (statusCode === 200) {
        toast.success(message);
      } else if (message) {
        toast.error(message);
      }
      resetForm();
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  //handle sign in with google
  const handleGoogleLogin = async (values) => {
    try {
      const token = values?.credential;

      const res = await signinwithGoogle(token);
      const { message: signinMsg, statusCode: signinStatus } = res;

      if (signinStatus === 200) {
        toast.success(signinMsg);
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
      } else if (signinMsg) {
        toast.error(signinMsg);
      }
    } catch (err) {
      toast.error(err.message || "Sign in with google failed");
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
    <div className="h-screen flex bg-slate-200">
      <div className="lg:w-[50%] w-full rounded-tl-2xl rounded-bl-2xl px-4 md:px-12 bg-white">
        <div className="h-full flex flex-col justify-center">
          <p className="font-extrabold text-3xl md:text-4xl md:mb-12 mb-4">
            LearnCode
          </p>
          <p className="font-semibold text-xl md:text-3xl md:mb-14 mb-8">
            Welcome to LearnCode! Please sign up to start your coding journey.
          </p>

          <div className="mb-8 flex justify-center ">
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
            <div className=" flex-1 border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 font-semibold">OR</span>
            <div className=" flex-1 border-t border-gray-300"></div>
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
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSubmit}
                  className="bg-black text-white md:py-3 py-2.5 md:text-lg text-base font-medium rounded-xl md:mb-4 mb-2   hover:bg-gray-700 hover:shadow-md transition duration-500"
                >
                  {loading ? "Loading..." : "Create Account"}
                </button>
              </>
            )}
          </Formik>

          <p className="md:text-lg text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:underline"
            >
              Login Here
            </Link>
          </p>
        </div>
      </div>

      <div className="w-[50%] lg:block hidden">
        <img
          src={codingImage}
          className="h-full w-full object-fill rounded-tr-2xl rounded-br-2xl"
        />
      </div>
    </div>
  );
};

export default SignUp;
