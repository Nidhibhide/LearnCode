import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { ChangePass, resetPassword } from "../../api/user";
import { toast } from "react-toastify";
import { InputField } from "../../components/index";
import { codingImage } from "../../images/index";

const ResetPassword = () => {
  const statusMessages = {
    200: "Password reset successfully",
    404: "User not found",
    500: "Unexpected error occurred",
    400: "Something went wrong",
  };
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [status, setStatus] = useState("");
  const [message, setMessage] = useState(
    " Please enter and confirm your new password to reset your account."
  );

  const token = searchParams.get("token");
  let email;

  const reset = async () => {
    try {
      const response = await resetPassword(token);
      const message = statusMessages[response?.status];
      if (response.status === 201) {
        email = response?.data?.data?.email;
        setStatus("pass");
      } else {
        toast.error(message);
        setStatus("fail");
        setMessage("Reset Link Expired or Invalid");
      }
    } catch (e) {
      console.error("resetPassword error", e);
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    reset();
  }, [token, navigate]);

  const handleResetPassword = async (values, { resetForm }) => {
    try {
      if (loading) return;
      setLoading(true);
      const data = {
        password: values.password,
        email,
      };

      const response = await ChangePass(data);

      const message = statusMessages[response?.status];

      if (response?.status === 200) {
        toast.success(message);
        setTimeout(() => navigate("/login"), 3000);
      } else if (message) {
        toast.error(message);
      }
      resetForm();
    } catch (err) {
      alert(err.message || "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object({
    password: Yup.string()
      .matches(/^\d+$/, "Password must contain digits only")
      .min(5, "Password must be at least 5 characters")
      .max(10, "Password must not exceed 10 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  return (
    <div className="h-screen flex bg-slate-200">
      <div className="lg:w-[50%] w-full rounded-tl-2xl rounded-bl-2xl px-4 md:px-12 bg-white">
        <div className="h-full flex flex-col justify-center">
          <p className="font-extrabold text-3xl md:text-4xl md:mb-12 mb-8">
            LearnCode
          </p>
          <p className="font-semibold text-2xl md:text-3xl mb-14">{message}</p>

          {status === "fail" ? (
            <>
              <button
                type="button"
                className="bg-black text-white py-3 font-medium rounded-xl md:mb-4 mb-2 hover:bg-gray-700 hover:shadow-md transition duration-500"
                onClick={() => navigate("/forgotPass")}
              >
                Send Again
              </button>
            </>
          ) : (
            <>
              <Formik
                initialValues={{ password: "", confirmPassword: "" }}
                validationSchema={validationSchema}
                onSubmit={handleResetPassword}
              >
                {({ handleSubmit }) => (
                  <>
                    <div className="flex flex-col space-y-4 mb-12">
                      <InputField
                        label="New Password"
                        name="password"
                        type="password"
                        placeholder="Enter new password"
                      />
                      <InputField
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="bg-black text-white py-3 font-medium rounded-xl md:mb-4 mb-2 hover:bg-gray-700 hover:shadow-md transition duration-500"
                    >
                      {loading ? "Loading..." : "Reset Password"}
                    </button>
                  </>
                )}
              </Formik>
            </>
          )}
        </div>
      </div>

      <div className="w-[50%] lg:block hidden">
        <img
          src={codingImage}
          className="h-full w-full object-fill rounded-tr-2xl rounded-br-2xl"
          alt="Coding"
        />
      </div>
    </div>
  );
};

export default ResetPassword;
