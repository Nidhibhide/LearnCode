import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { codingImage } from "../../images/index";
import { Formik } from "formik";
import { getMe, signin } from "../../api/user";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { InputField } from "../../components/index";
import { useNavigate, useSearchParams } from "react-router-dom";

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
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
      const { message: signinMsg, statusCode: signinStatus } = signinRes;

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
      } else if (signinStatus === 400) {
        toast.error(signinMsg);
        setTimeout(() => navigate("/resend-verify"), 3000);
      } else if (signinMsg) {
        toast.error(signinMsg);
      }
      resetForm();
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // validation schema
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),

    password: Yup.string()
      .matches(/^\d+$/, "Password must contain digits only")
      .min(5, "Password must be at least 5 characters")
      .max(10, "Password must not exceed 10 characters")
      .required("Password is required"),
  });
  return (
    <div className="h-screen flex  bg-slate-200">
      <div className=" lg:w-[50%] w-full rounded-tl-2xl rounded-bl-2xl px-4  md:px-12 bg-white ">
        <div className=" h-full flex flex-col justify-center">
          <p className="font-extrabold text-3xl md:text-4xl md:mb-12 mb-4">
            LearnCode
          </p>
          <p className="font-semibold text-xl md:text-3xl mb-14">
            {" "}
            Welcome to LearnCode! Please sign In to start your coding journey.
          </p>

          {/* form */}

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSignIn}
          >
            {({ handleSubmit }) => (
              <>
                <div className="flex flex-col space-y-4 mb-12">
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
                  onClick={handleSubmit}
                  type="button"
                  disabled={loading}
                  className="bg-black text-white md:py-3 py-2.5 md:text-lg text-base font-medium rounded-xl md:mb-4 mb-2 hover:bg-gray-700 hover:shadow-md transition duration-500"
                >
                  {loading ? "Loading..." : "Sign In"}
                </button>
                <p className="md:text-lg text-sm ">
                  Forgot Password?{" "}
                  <Link
                    to="/forgotPass"
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    Click Here
                  </Link>
                </p>
              </>
            )}
          </Formik>
        </div>
      </div>
      <div className=" w-[50%] lg:block hidden ">
        <img
          src={codingImage}
          className="h-full w-full object-fill rounded-tr-2xl rounded-br-2xl"
        />
      </div>
    </div>
  );
};

export default SignIn;
