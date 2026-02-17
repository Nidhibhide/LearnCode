import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import {
  ModalWrapper,
  FormWrapper,
  InputField,
  Button
} from "../../../components/index";
import {
  VerifyCurrentPassword,
  ChangePass,
} from "../../../api/user";
import { stringValidator, matchValidator, passwordValidator } from "../../../validation/GlobalValidation";
import { getUserEmail, navigateTo, delay, ROUTES, handleApiResponse, handleApiError } from "../../../utils";
import * as Yup from "yup";

const ChangePassword = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const email = getUserEmail();

  useEffect(() => {
    if (email) {
      setIsOpen(true);
    }
  }, [email]);

  const handleVerifyCurrentPass = async (values) => {
    const data = {
      password: values?.currentPassword,
      email,
    };

    try {
      if (loading) return;
      setLoading(true);
      const res = await VerifyCurrentPassword(data);
      const { status } = handleApiResponse(res);

      if (status === 200) {
        setStep(1);
      }
    } catch (err) {
      handleApiError(err, "Verify Current Password failed");
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
      const { status } = handleApiResponse(res, { successMessage: "Password updated successfully" });

      if (status === 200) {
        await delay(3000);
        navigateTo(window.history, ROUTES.DASHBOARD + "/setting");
      }
      resetForm();
    } catch (err) {
      handleApiError(err, "Change Password failed");
    } finally {
      setLoading(false);
    }
  };

  const passwordValidationSchema = Yup.object().shape({
    currentPassword: passwordValidator("Current password", 8, 12, true),
  });

  const newPasswordValidationSchema = Yup.object().shape({
    password: passwordValidator("New password", 8, 12, true),
    confirmPassword: matchValidator("Confirm password", "password", "Password", true),
  });

  return (
    <ModalWrapper
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      title={step === 1 ? "Change Password" : "Verify Password"}
    >
      <div className="text-center mb-4">
        <span className="text-blue-600 font-bold text-lg tracking-wide">
          🔐 Step {step + 1} of 2
        </span>
      </div>

      <FormWrapper
        initialValues={{
          password: "",
          confirmPassword: "",
          currentPassword: "",
        }}
        validationSchema={
          step === 0 ? passwordValidationSchema : newPasswordValidationSchema
        }
        onSubmit={
          step === 0 ? handleVerifyCurrentPass : handleConfirm
        }
      >
        {({ handleSubmit }) => (
          <>
            <div className="flex flex-col space-y-4 mb-12">
              {step === 0 && (
                <InputField
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  placeholder="Current password"
                />
              )}
              {step === 1 && (
                <>
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
                </>
              )}
            </div>

            <Button
              loading={loading}
              onClick={handleSubmit}
              loadingText="Loading..."
            >
              {step === 0 ? "Verify Password" : "Change Password"}
            </Button>
          </>
        )}
      </FormWrapper>
    </ModalWrapper>
  );
};

export default ChangePassword;
