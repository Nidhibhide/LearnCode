import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { update } from "../../../api/user";
import { toast } from "react-toastify";
import {
  ModalWrapper,
  FormWrapper,
  InputField,
  Button
} from "../../../components/index";
import { alphabetStringValidator, emailValidator } from "../../../validation/GlobalValidation";
import { setUser } from "../../../redux/features/userSlice";
import { navigateTo, delay, ROUTES, handleApiResponse, handleApiError } from "../../../utils";
import * as Yup from "yup";

const EditProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const id = user?._id;

  useEffect(() => {
    if (user) {
      setIsOpen(true);
    }
  }, [user]);

  const handleUpdateProfile = async (values, { resetForm }) => {
    try {
      if (loading) return;
      setLoading(true);
      const res = await update(values, id);
      const { status, data } = handleApiResponse(res);

      if (status === 200) {
        dispatch(setUser(data));
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

  const userProfileValidationSchema = Yup.object().shape({
    name: alphabetStringValidator("Name", 2, 50, true),
    email: emailValidator("Email", true),
  });

  return (
    <ModalWrapper
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      title="Edit Profile"
    >
      <FormWrapper
        initialValues={{
          name: user?.name || "",
          email: user?.email || "",
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
