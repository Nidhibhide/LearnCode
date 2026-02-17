import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { ChangePass, resetPassword } from "../../api/user";
import { toast } from "react-toastify";
import { InputField, Button, AuthImage } from "../../components/index";
import { handleApiResponse, handleApiError } from "../../utils";
import { stringValidator, matchValidator, passwordValidator } from "../../validation/GlobalValidation";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const [status, setStatus] = useState("");
  const [message, setMessage] = useState(
    " Please enter and confirm your new password to reset your account."
  );

  const token = searchParams.get("token");

  const reset = async () => {
    try {
      const response = await resetPassword(token);
      const { status, message } = handleApiResponse(response);
      if (status === 200) {
        setEmail(response?.data?.email);
        setStatus("pass");
      } else {
        setStatus("fail");
        setMessage("Reset Link Expired or Invalid");
      }
    } catch (e) {
      console.error("resetPassword error", e);
      handleApiError(e, "Something went wrong!");
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
        email: email,
        password: values.password,
      };

      const response = await ChangePass(data);
      const { status } = handleApiResponse(response);

      if (status === 200) {
        setTimeout(() => navigate("/login"), 3000);
      }
      resetForm();
    } catch (err) {
      handleApiError(err, "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Validation schema - using validators directly from GlobalValidation
  const validationSchema = Yup.object({
    password: passwordValidator("Password", 8, 12, true),
    confirmPassword: matchValidator("Confirm password", "password", "Password", true),
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
              <Button
                onClick={() => navigate("/forgotPass")}
              >
                Send Again
              </Button>
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
                    <Button
                      loading={loading}
                      onClick={handleSubmit}
                    >
                      Reset Password
                    </Button>
                  </>
                )}
              </Formik>
            </>
          )}
        </div>
      </div>

      <AuthImage />
    </div>
  );
};

export default ResetPassword;
