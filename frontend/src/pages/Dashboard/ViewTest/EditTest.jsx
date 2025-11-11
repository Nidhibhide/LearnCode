import { useEffect, useState } from "react";
import { edit } from "../../../api/test";
import { toast } from "react-toastify";
import { useParams, useLocation } from "react-router-dom";
import {
  ModalWrapper,
  FormWrapper,
  InputField,
  Button
} from "../../../components/index";
import { testValidationSchema } from "../../../validation";
import { SUPPORTED_LANGUAGES, TEST_LEVELS, ROUTES } from "../../../constants";
import { navigateTo, delay, handleApiResponse, handleApiError } from "../../../utils";

function EditTest() {
  const { testId } = useParams();
  const { state } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const test = state?.test || {};

  useEffect(() => {
    if (test && testId) {
      setIsOpen(true);
    }
  }, [test, testId]);

  const handleEdit = async (values, { resetForm }) => {
    try {
      if (loading) return;
      setLoading(true);
      const response = await edit(testId, values);
      const { status } = handleApiResponse(response);

      if (status === 200) {
        await delay(3000);
        navigateTo(window.history, ROUTES.DASHBOARD + "/viewTest");
      }
      resetForm();
    } catch (err) {
      handleApiError(err, "test editing failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      title="Edit Test"
    >
      <FormWrapper
        initialValues={{
          name: test?.name || "",
          level: test?.level || "",
          language: test?.language || "",
          numOfQuestions: test?.numOfQuestions || "",
        }}
        validationSchema={testValidationSchema}
        onSubmit={handleEdit}
      >
        {({ handleSubmit }) => (
          <>
            <div className="flex flex-col space-y-4 md:mb-12 mb-6">
              <InputField
                label="Name of Test"
                name="name"
                type="text"
                placeholder="Enter test name"
              />
              <InputField
                label="No of Questions"
                name="numOfQuestions"
                type="number"
                placeholder="Enter No of Questions"
              />
              <InputField
                label="Language"
                name="language"
                as="select"
                options={SUPPORTED_LANGUAGES}
              />
              <InputField
                label="Test Level"
                name="level"
                as="select"
                options={TEST_LEVELS}
              />
            </div>

            <Button
              loading={loading}
              onClick={handleSubmit}
              loadingText="Updating..."
            >
              Update Test
            </Button>
          </>
        )}
      </FormWrapper>
    </ModalWrapper>
  );
}

export default EditTest;
