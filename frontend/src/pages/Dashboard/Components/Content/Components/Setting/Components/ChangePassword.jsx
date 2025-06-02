import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/react";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Formik } from "formik";
import { InputField } from "../../../../../../../components/index";
import * as Yup from "yup";
import {
  VerifyCurrentPassword,
  ChangePass,
} from "../../../../../../../api/user";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const email = JSON.parse(localStorage.getItem("data"))?.email;
  const { isOpen, onOpen } = useDisclosure();

  useEffect(() => {
    if (email) {
      onOpen();
    }
  }, [email, onOpen]);
  const handleOpenChange = (open) => {
    if (!open) {
      navigate(-1);
    }
  };
  const statusMessages = {
    401: "Incorrect password",
    404: "User not found",
    500: "Unexpected error occurred while update password ",
  };
  const currentPasswordSchema = Yup.object({
    currentPassword: Yup.string()
      .matches(/^\d+$/, "Password must contain digits only")
      .min(5, "Must be at least 5 digits")
      .max(10, "Must not exceed 10 digits")
      .required("Current password is required"),
  });

  const newPasswordSchema = Yup.object({
    password: Yup.string()
      .matches(/^\d+$/, "Password must contain digits only")
      .min(5, "Must be at least 5 digits")
      .max(10, "Must not exceed 10 digits")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm your password"),
  });

  const handleVerifyCurrentPass = async (values) => {
    const data = {
      password: values?.currentPassword,
      email,
    };

    try {
      if (loading) return;
      setLoading(true);
      const res = await VerifyCurrentPassword(data);
      const message = statusMessages[res?.status];

      if (res.status === 200) {
        setStep(1);
      } else if (message) {
        toast.error(message);
      }
    } catch (err) {
      alert(err.message || "Verify Current Password failed");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (values, { resetForm }) => {
    try {
      const data = {
        email,
        password: values.password,
      };
      if (loading) return;
      setLoading(true);
      const res = await ChangePass(data);
      const message = statusMessages[res?.status];

      if (res.status === 200) {
        toast.success("Password updated successfully");
        setTimeout(() => navigate("/dashboard/setting"), 3000);
      } else if (message) {
        toast.error(message);
      }
      resetForm();
    } catch (err) {
      alert(err.message || "Change Password failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={handleOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {step == 1 ? "Change Password" : "Verify Password"}
              </ModalHeader>
              <ModalBody>
                <div className="text-center">
                  <span className="text-blue-600 font-bold text-lg tracking-wide">
                    🔐 Step {step + 1} of 2
                  </span>
                </div>

                <Formik
                  initialValues={{
                    password: "",
                    confirmPassword: "",
                    currentPassword: "",
                  }}
                  validationSchema={
                    step === 0 ? currentPasswordSchema : newPasswordSchema
                  }
                  onSubmit={
                    step === 0 ? handleVerifyCurrentPass : handleConfirm
                  }
                >
                  {({ handleSubmit }) => (
                    <>
                      <div className="flex flex-col space-y-4 mb-12">
                        <div className={step === 0 ? "" : "hidden"}>
                          <InputField
                            label="Current Password"
                            name="currentPassword"
                            type="password"
                            placeholder="Current password"
                          />
                        </div>
                        <div className={step === 1 ? "" : "hidden"}>
                          <InputField
                            label="New Password"
                            name="password"
                            type="password"
                            placeholder="Enter new password"
                          />
                        </div>
                        <div className={step === 1 ? "" : "hidden"}>
                          <InputField
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="bg-black w-full text-white py-3 font-medium rounded-xl md:mb-4 mb-2 hover:bg-gray-700 hover:shadow-md transition duration-500"
                      >
                        {loading
                          ? "Loading..."
                          : step === 0
                          ? "Verify Password"
                          : "Change Password"}
                      </button>
                    </>
                  )}
                </Formik>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChangePassword;
