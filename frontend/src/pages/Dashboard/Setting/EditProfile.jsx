import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { update } from "../../../api/user";
import { updateDobNotify } from "../../../api/notification";
import { toast } from "react-toastify";
import { DatePicker } from "@heroui/react";
import { parseDate } from "@internationalized/date";
import {
  ModalWrapper,
  FormWrapper,
  InputField,
  Button,
} from "../../../components/index";
import {
  alphabetStringValidator,
  emailValidator,
  dateValidator,
} from "../../../validation/GlobalValidation";
import { setUser } from "../../../redux/features/userSlice";
import { filterProfileNotification } from "../../../redux/features/notificationSlice";
import {
  navigateTo,
  delay,
  ROUTES,
  handleApiResponse,
  handleApiError,
} from "../../../utils";
import * as Yup from "yup";

const EditProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const unreadNotifications = useSelector(
    (state) => state.notifications.unreadNotifications || [],
  );
  const readNotifications = useSelector(
    (state) => state.notifications.readNotifications || [],
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

      // Format date to string for backend
      const dob = values.dob ? values.dob.toString() : "";

      const res = await update({ ...values, dob }, id);
      const { status, data } = handleApiResponse(res);

      console.log(data);
      if (status === 200) {
        dispatch(setUser(data));

        // Call notification update if user has existing DOB
        if (data?.dob) {
          await updateDobNotify(id);

          // Filter out from both arrays using the ID
          dispatch(filterProfileNotification());
        }

        await delay(3000);
        navigateTo(navigate, ROUTES.DASHBOARD + "/setting");
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
    dob: dateValidator("Date of Birth", false),
  });

  return (
    <ModalWrapper isOpen={isOpen} onOpenChange={setIsOpen} title="Edit Profile">
      <FormWrapper
        initialValues={{
          name: user?.name || "",
          email: user?.email || "",
          dob: user?.dob ? parseDate(user.dob.split("T")[0]) : undefined,
        }}
        validationSchema={userProfileValidationSchema}
        onSubmit={handleUpdateProfile}
      >
        {({ handleSubmit, setFieldValue, values, errors, touched }) => (
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
              <div className="flex flex-col space-y-1">
                <p className="md:text-lg text-base font-medium">
                  Date of Birth{" "}
                  <span className="text-sm text-gray-600 font-normal">
                    (MM-DD-YYYY)
                  </span>
                </p>
                <DatePicker
                  name="dob"
                  value={values.dob}
                  onChange={(date) => setFieldValue("dob", date)}
                  className="w-full"
                  placeholder="Select your date of birth"
                  variant="bordered"
                />
                {errors.dob && touched.dob && (
                  <p className="text-sm text-red-500">{errors.dob}</p>
                )}
              </div>
            </div>
            <Button
              loading={loading}
              onClick={handleSubmit}
              loadingText="Updating..."
              width="w-full"
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
