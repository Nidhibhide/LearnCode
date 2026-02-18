import React, { useState } from "react";

import { Formik } from "formik";
import { forgotPass } from "../../api/user";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { InputField, Button, AuthImage } from "../../components/index";
import { useNavigate } from "react-router-dom";
import { handleApiResponse, handleApiError } from "../../utils";
import { emailValidator } from "../../validation/GlobalValidation";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // handle forgot Password
  const handleForgotPass = async (values, { resetForm }) => {
    try {
      if (loading) return;
      setLoading(true);
      const response = await forgotPass(values);
      handleApiResponse(response);
      resetForm();
    } catch (err) {
      handleApiError(err, "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // validation schema
  const validationSchema = Yup.object({
    email: emailValidator("Email", true),
  });
  return (
    <div className="h-screen flex  bg-slate-200">
      <div className=" lg:w-[50%] w-full rounded-tl-2xl rounded-bl-2xl px-4  md:px-12 bg-white ">
        <div className=" h-full flex flex-col justify-center">
          <p className="font-extrabold text-3xl md:text-4xl md:mb-12 mb-4">
            LearnCode
          </p>
          <p className="font-semibold text-xl md:text-3xl mb-14">
            Forgot your password? Enter your email to receive reset
            instructions.
          </p>

          {/* form */}

          <Formik
            initialValues={{ email: "" }}
            validationSchema={validationSchema}
            onSubmit={handleForgotPass}
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
                </div>

                <div className="flex gap-4">
                  <Button
                    width="w-full"
                    loading={loading}
                    onClick={handleSubmit}
                  >
                    Send reset Link
                  </Button>
                  <Button width="w-full" onClick={() => navigate("/")}>
                    Home
                  </Button>
                </div>
              </>
            )}
          </Formik>
        </div>
      </div>
      <AuthImage />
    </div>
  );
};

export default ForgotPassword;
