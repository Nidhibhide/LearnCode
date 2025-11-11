import React, { useState } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { toast } from "react-toastify";
import { InputField, Button, AuthImage } from "../../components/index";
import { resendVerify } from "../../api/user";
import { useNavigate } from "react-router-dom";
import { handleApiResponse, handleApiError } from "../../utils";

const ResendVerification = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResendVerification = async (values, { resetForm }) => {
    try {
      if (loading) return;
      setLoading(true);
      const response = await resendVerify(values);
      const { status, message } = handleApiResponse(response, { showSuccessToast: false });

      if (status === 200) {
        toast.success(message + values?.email);
      } else if (status === 400) {
        setTimeout(() => navigate("/login"), 3000);
      }
      resetForm();
    } catch (err) {
      console.log(err.message || "Error while resending verification email");
      handleApiError(err);
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

                <Button
                  loading={loading}
                  onClick={handleSubmit}
                >
                  Send Email
                </Button>
              </>
            )}
          </Formik>
        </div>
      </div>

      <AuthImage />
    </div>
  );
};

export default ResendVerification;
