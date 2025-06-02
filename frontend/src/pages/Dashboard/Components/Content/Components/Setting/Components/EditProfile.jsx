import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { update } from "../../../../../../../api/user";
import { toast } from "react-toastify";
import { Formik } from "formik";
import { InputField } from "../../../../../../../components/index";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const EditProfile = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const data = JSON.parse(localStorage.getItem("data"));
  const { isOpen, onOpen } = useDisclosure();
  const id = JSON.parse(localStorage.getItem("data"))?._id;
  useEffect(() => {
    if (data) {
      onOpen();
    }
  }, [data, onOpen]);
  const handleOpenChange = (open) => {
    if (!open) {
      navigate(-1);
    }
  };
  const statusMessages = {
    201: "Profile updated! Refresh the page to see the latest changes.",
    404: "User not found",
    400: "Cannot update email for Google-authenticated users",
    500: "Unexpected error occurred while update profile ",
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "Only alphabets and spaces are allowed")
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name should not exceed 50 characters")
      .required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={handleOpenChange}>
        <ModalContent>
          {(onClose) => {
            const handleUpdateProfile = async (values, { resetForm }) => {
              try {
                if (loading) return;
                setLoading(true);
                const res = await update(values, id);
                const message = statusMessages[res?.status];

                if (res.status === 201 && message) {
                  localStorage.setItem("data", JSON.stringify(res?.data?.data));
                  toast.success(message);
                  setTimeout(() => navigate("/dashboard/setting"), 3000);
                } else if (message) {
                  toast.error(message);
                }

                resetForm();
              } catch (err) {
                alert(err.message || "Update Profile failed");
              } finally {
                onClose();
                setLoading(false);
              }
            };

            return (
              <>
                <ModalHeader>Edit Profile</ModalHeader>
                <ModalBody>
                  <Formik
                    initialValues={{
                      name: data?.name || "",
                      email: data?.email || "",
                    }}
                    validationSchema={validationSchema}
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
                        <button
                          type="button"
                          disabled={loading}
                          onClick={handleSubmit}
                          className="bg-black text-white py-3 font-medium rounded-xl mb-2 md:mb-4 hover:bg-gray-700 hover:shadow-md transition duration-500"
                        >
                          {loading ? "Loading..." : "Update Profile"}
                        </button>
                      </>
                    )}
                  </Formik>
                </ModalBody>
              </>
            );
          }}
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditProfile;
