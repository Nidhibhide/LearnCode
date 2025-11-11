import { useEffect, useState } from "react";
import { update } from "../../../api/user";
import { toast } from "react-toastify";
import {
  ModalWrapper,
  FormWrapper,
  InputField,
  Button
} from "../../../components/index";
import { userProfileValidationSchema } from "../../../validation";
import { getUserData, setUserData, navigateTo, delay, ROUTES, handleApiResponse, handleApiError } from "../../../utils";

const EditProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const data = getUserData();
  const id = data?._id;

  useEffect(() => {
    if (data) {
      setIsOpen(true);
    }
  }, [data]);

  const handleUpdateProfile = async (values, { resetForm }) => {
    try {
      if (loading) return;
      setLoading(true);
      const res = await update(values, id);
      const { status, data } = handleApiResponse(res);

      if (status === 200) {
        setUserData(data);
        await delay(3000);
        navigateTo(window.history, ROUTES.DASHBOARD + "/setting");
      }

      resetForm();
    } catch (err) {
      handleApiError(err, "Update Profile failed");
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      title="Edit Profile"
    >
      <FormWrapper
        initialValues={{
          name: data?.name || "",
          email: data?.email || "",
        }}
        validationSchema={userProfileValidationSchema}
        onSubmit={handleUpdateProfile}
      >
        {({ handleSubmit }) => (
          <>
            <div className="flex flex-col space-y-4 mb-12">
              <InputField
                label="Name"
                name="name"
                type="text"
                placeholder="Enter your name"
              />
              <InputField
                label="Email"
                name="email"
                type="email"
                placeholder="Enter your Email"
              />
            </div>
            <Button
              loading={loading}
              onClick={handleSubmit}
              loadingText="Updating..."
            >
              Update Profile
            </Button>
          </>
        )}
      </FormWrapper>
    </ModalWrapper>
  );
};

export default EditProfile;
