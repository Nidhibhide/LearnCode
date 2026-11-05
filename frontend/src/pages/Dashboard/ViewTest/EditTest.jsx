import { useEffect, useState } from "react";
import { edit } from "../../../api/test";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  ModalWrapper,
  FormWrapper,
  InputField,
  Button
} from "../../../components/index";
import { stringValidator } from "../../../validation/GlobalValidation";
import { ROUTES } from "../../../constants";
import { navigateTo, delay, handleApiResponse, handleApiError } from "../../../utils";
import * as Yup from "yup";

function EditTest() {
  const { testId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
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
      const response = await edit(testId, { name: values.name });
      const { status } = handleApiResponse(response);

      if (status === 200) {
        await delay(3000);
        navigateTo(navigate, ROUTES.DASHBOARD + "/viewTest");
      }
      resetForm();
    } catch (err) {
      handleApiError(err, "test editing failed");
    } finally {
      setLoading(false);
    }
  };

  const testValidationSchema = Yup.object().shape({
    name: stringValidator("Test name", 3, 100, true),
  });

  const readOnlyField = (label, value) => (
    <div className="flex flex-col space-y-1">
      <p className="md:text-lg text-base font-medium">{label}</p>
      <div className="md:py-3 md:px-4 py-2 px-2 rounded-lg border border-borderDark bg-surfaceAlt text-textSecondary w-full">
        {value || "—"}
      </div>
    </div>
  );

  return (
    <ModalWrapper
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      title="Edit Test"
    >
      <FormWrapper
        initialValues={{
          name: test?.name || "",
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
              {readOnlyField("No of Questions", test?.numOfQuestions)}
              {readOnlyField("Language", test?.language)}
              {readOnlyField("Test Level", test?.level)}
            </div>

            <Button
              loading={loading}
              onClick={handleSubmit}
              loadingText="Updating..."
              width="w-full"
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
