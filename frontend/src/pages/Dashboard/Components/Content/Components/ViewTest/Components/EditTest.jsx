import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { Formik } from "formik";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { InputField } from "../../../../../../../components/index";
import * as Yup from "yup";
function EditTest() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { testId } = useParams(); // from URL
  const [loading, setLoading] = useState(false);
  const { state } = useLocation(); // from navigation state
  const navigate = useNavigate();
  const test = state?.test || "Not Available";
  console.log(test);
  useEffect(() => {
    onOpen();
  }, [onOpen]);

  //validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Test name must be at least 3 characters")
      .max(100, "Test name should not exceed 100 characters")
      .required("Test name is required"),

    numOfQuestions: Yup.number()
      .typeError("Number of questions must be a number")
      .integer("Number of questions must be an integer")
      .min(1, "There must be at least 1 question")
      .max(100, "Questions should not exceed 100")
      .required("Number of questions is required"),

    language: Yup.string()
      .oneOf(
        ["Java", "C++", "JavaScript", "Python", "C"],
        "Language must be one of Java, C++, JavaScript, Python, or C"
      )
      .required("Language is required"),

    level: Yup.string()
      .oneOf(
        ["Basic", "Intermediate", "Advanced"],
        "Level must be one of Basic, Intermediate, or Advanced"
      )
      .required("Level is required"),
  });

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Edit Test</ModalHeader>
              <ModalBody>
                <Formik
                  initialValues={{
                    name: "" || test?.name,
                    level: "" || test?.level,
                    language: "" || test?.language,
                    numOfQuestions: "" || test?.numOfQuestions,
                  }}
                  validationSchema={validationSchema}
                  // onSubmit={handleCreate}
                >
                  {({ handleSubmit }) => (
                    <>
                      <div className="flex flex-col space-y-4 mb-12">
                        <div className="flex flex-col space-y-1">
                          <InputField
                            label="Name of Test"
                            name="name"
                            type="text"
                            placeholder="Enter test name"
                          />
                        </div>
                        <div className="flex flex-col space-y-1">
                          <InputField
                            label="No of Questions"
                            name="numOfQuestions"
                            type="number"
                            placeholder="Enter No of Questions "
                          />
                        </div>
                        <div className="flex flex-col space-y-1">
                          <InputField
                            label="Language"
                            name="language"
                            as="select"
                            options={[
                              "Java",
                              "C++",
                              "JavaScript",
                              "Python",
                              "C",
                            ]}
                          />
                        </div>
                        <div className="flex flex-col space-y-1">
                          <InputField
                            label="Test Level"
                            name="level"
                            as="select"
                            options={["Basic", "Intermediate", "Advanced"]}
                          />
                        </div>
                      </div>

                      {/* <button
                        onClick={handleSubmit}
                        type="button"
                        disabled={loading}
                        className="bg-black text-white w-full py-3 font-medium rounded-xl md:mb-4 mb-2 hover:bg-gray-700 hover:shadow-md transition duration-500"
                      >
                        {loading ? "Loading..." : "Update Test"}
                      </button> */}
                    </>
                  )}
                </Formik>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    onClose();
                    navigate("/dashboard/viewTest");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    onClose();
                    navigate("/dashboard/viewTest");
                  }}
                >
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default EditTest;
