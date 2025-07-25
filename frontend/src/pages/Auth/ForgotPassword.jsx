import React, { useState } from "react";

import { codingImage } from "../../images/index";
import { Formik } from "formik";
import { forgotPass } from "../../api/user";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { InputField } from "../../components/index";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  // handle forgot Password
  const handleForgotPass = async (values, { resetForm }) => {
    try {
      if (loading) return;
      setLoading(true);
      const response = await forgotPass(values);

      const { message, statusCode } = response;

      if (statusCode === 200) {
        toast.success(message);
      } else if (message) {
        toast.error(message);
      }
      resetForm();
    } catch (err) {
      toast.error(
        err.message || "Something went wrong. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  // validation schema
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
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

                <button
                  onClick={handleSubmit}
                  type="button"
                  className="bg-black text-white md:py-3 py-2.5 md:text-lg text-base font-medium rounded-xl md:mb-4 mb-2 hover:bg-gray-700 hover:shadow-md transition duration-500"
                >
                  {loading ? "Loading..." : "Send reset Link"}
                </button>
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

export default ForgotPassword;
