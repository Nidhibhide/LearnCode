import { useState } from "react";
import { ModalWrapper, FormWrapper, InputField, Button } from "../../components/index";
import { create } from "../../api/test";
import * as Yup from "yup";
import { handleApiResponse, handleApiError, delay } from "../../utils";
import { stringValidator, integerValidator, selectValidator } from "../../validation/GlobalValidation";
import { SUPPORTED_LANGUAGES, TEST_LEVELS } from "../../constants";

const CreateTest = () => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  // handle create test
  const handleCreate = async (values, { resetForm }) => {
    try {
      if (loading) return;
      setLoading(true);
      const response = await create(values);
      const { status } = handleApiResponse(response);

      if (status === 201) {
        await delay(3000);
        setIsOpen(false);
      }
      resetForm();
    } catch (err) {
      handleApiError(err, "test creation failed");
    } finally {
      setLoading(false);
    }
  };

  //validation schema - using validators directly from GlobalValidation
  const validationSchema = Yup.object().shape({
    name: stringValidator("Test name", 3, 100, true),
    numOfQuestions: integerValidator("Number of questions", 1, 100, true),
    language: selectValidator("Language", SUPPORTED_LANGUAGES, true),
    level: selectValidator("Level", TEST_LEVELS, true),
  });

  return (
    <ModalWrapper
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      title="Create Test"
    >
      <FormWrapper
        initialValues={{
          name: "",
          level: "",
          language: "",
          numOfQuestions: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleCreate}
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
              loadingText="Creating..."
              width="w-full"
            >
              Create Test
            </Button>
          </>
        )}
      </FormWrapper>
    </ModalWrapper>
  );
};

export default CreateTest;
