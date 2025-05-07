import React, { useState } from "react";
import { codingImage } from "../../images/index";
import * as Yup from "yup";
import { Formik } from "formik";
import { toast } from "react-toastify";
import InputField from "../../components/InputField";
import { resendVerify } from "../../api/user";
import { useNavigate } from "react-router-dom";

const ResendVerification = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const statusMessages = {
    200: "Verification email has been resent to ",
    400: "User already verified",
    404: "User not found",
    500: "Unexpected error occurred while sign in",
  };

  const handleResendVerification = async (values, { resetForm }) => {
    try {
      if (loading) return;
      setLoading(true);
      const response = await resendVerify(values);

      const message = statusMessages[response?.status];
      if (response?.status === 200) {
        toast.success(message + values?.email);
      } else if (response?.status === 400) {
        toast.error(message);
        setTimeout(() => navigate("/login"), 3000);
      } else if (message) {
        toast.error(message);
      }
      resetForm();
    } catch (err) {
      console.log(err.message || "Error while resending verification email");
    } finally {
      setLoading(false);
    }
  };
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  return (
    <div className="h-screen flex bg-slate-200">
      <div className="lg:w-[50%] w-full rounded-tl-2xl rounded-bl-2xl px-4  md:px-12 bg-white ">
        <div className=" h-full flex flex-col justify-center">
          <p className="font-extrabold text-3xl md:text-4xl md:mb-6 mb-4">
            LearnCode
          </p>
          <p className="font-semibold text-2xl md:text-3xl mb-8">
            Resend your verification email
          </p>

          {/* form */}

          <Formik
            initialValues={{ email: "" }}
            validationSchema={validationSchema}
            onSubmit={handleResendVerification}
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
                  className="bg-black text-white py-3 font-medium rounded-xl md:mb-4 mb-2 hover:bg-gray-700 hover:shadow-md transition duration-500"
                >
                  {loading ? "Loading..." : "Send Email"}
                </button>
              </>
            )}
          </Formik>
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

export default ResendVerification;
