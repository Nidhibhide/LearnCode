import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ModalWrapper, FormWrapper, InputField, Button } from "../../components/index";
import { create, previewQuestions } from "../../api/test";
import * as Yup from "yup";
import { FaArrowsRotate } from "react-icons/fa6";
import { handleApiResponse, handleApiError, delay, navigateTo } from "../../utils";
import { stringValidator, integerValidator, selectValidator } from "../../validation/GlobalValidation";
import { SUPPORTED_LANGUAGES, TEST_LEVELS, ROUTES } from "../../constants";

const MAX_REGENERATES = 3;

const CreateTest = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [step, setStep] = useState("form"); // form | preview
  const [formValues, setFormValues] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [regenerateCount, setRegenerateCount] = useState(0);

  const validationSchema = Yup.object().shape({
    name: stringValidator("Test name", 3, 100, true),
    numOfQuestions: integerValidator("Number of questions", 1, 5, true),
    language: selectValidator("Language", SUPPORTED_LANGUAGES, true),
    level: selectValidator("Level", TEST_LEVELS, true),
  });

  const generatePreview = async (values) => {
    const response = await previewQuestions({
      language: values.language,
      level: values.level,
      numOfQuestions: Number(values.numOfQuestions),
    });
    const { status, data } = handleApiResponse(response, {
      showSuccessToast: false,
    });
    if (status === 200 && Array.isArray(data)) {
      return data;
    }
    return null;
  };

  // Step 1: validate form and show question preview
  const handlePreview = async (values) => {
    try {
      if (loading) return;
      setLoading(true);
      const data = await generatePreview(values);
      if (data) {
        setFormValues(values);
        setQuestions(data);
        setRegenerateCount(0);
        setStep("preview");
      }
    } catch (err) {
      handleApiError(err, "Failed to generate questions");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!formValues || regenerateCount >= MAX_REGENERATES || loading) return;
    try {
      setLoading(true);
      const data = await generatePreview(formValues);
      if (data) {
        setQuestions(data);
        setRegenerateCount((count) => count + 1);
      }
    } catch (err) {
      handleApiError(err, "Failed to regenerate questions");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: create test with reviewed questions
  const handleProceed = async () => {
    if (!formValues || !questions.length || loading) return;
    try {
      setLoading(true);
      const response = await create({
        ...formValues,
        numOfQuestions: Number(formValues.numOfQuestions),
        questions,
      });
      const { status } = handleApiResponse(response);

      if (status === 201) {
        await delay(3000);
        navigateTo(navigate, ROUTES.DASHBOARD + "/viewTest");
      }
    } catch (err) {
      handleApiError(err, "test creation failed");
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  const regeneratesLeft = MAX_REGENERATES - regenerateCount;

  return (
    <ModalWrapper
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      title={step === "preview" ? "Preview Questions" : "Create Test"}
      size={step === "preview" ? "2xl" : "md"}
    >
      {step === "form" ? (
        <FormWrapper
          initialValues={{
            name: formValues?.name || "",
            level: formValues?.level || "",
            language: formValues?.language || "",
            numOfQuestions: formValues?.numOfQuestions || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handlePreview}
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
                  min={1}
                  max={5}
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
                loadingText="Generating..."
                width="w-full"
              >
                Preview Questions
              </Button>
            </>
          )}
        </FormWrapper>
      ) : (
        <div className="flex flex-col">
          <div className="flex items-center justify-end gap-2 mb-4">
            <span className="text-base md:text-lg font-bold text-error bg-errorBg px-2.5 py-1 rounded-lg whitespace-nowrap">
              {regeneratesLeft} left
            </span>
            <button
              type="button"
              title="Regenerate questions"
              aria-label="Regenerate questions"
              onClick={handleRegenerate}
              disabled={regeneratesLeft <= 0 || loading}
              className={`p-2 rounded-lg border border-border transition ${
                regeneratesLeft <= 0 || loading
                  ? "text-textMuted cursor-not-allowed opacity-50"
                  : "text-primary hover:bg-primary/10"
              }`}
            >
              <FaArrowsRotate
                size={16}
                className={loading ? "animate-spin" : ""}
              />
            </button>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[50vh] mb-6 pr-1">
            {questions.map((item, index) => (
              <div
                key={`${index}-${item.questionText?.slice(0, 24)}`}
                className="p-3 border border-border rounded-md bg-surfaceAlt w-full break-words"
              >
                <p className="font-semibold mb-1">
                  Q{index + 1}: {item.questionText}
                </p>
                <p className="text-sm mb-1">
                  <strong>Input:</strong> {item.sampleInput || "—"}
                </p>
                <p className="text-sm">
                  <strong>Output:</strong> {item.expectedOutput}
                </p>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              width="w-full"
              loading={loading}
              loadingText="Creating..."
              onClick={handleProceed}
            >
              Proceed
            </Button>
            <Button
              width="w-full"
              className="bg-surfaceAlt text-textPrimary border border-border py-3 font-medium rounded-xl mb-2 md:mb-4 hover:bg-border/40 transition duration-500"
              onClick={() => setStep("form")}
              disabled={loading}
            >
              Back
            </Button>
          </div>
        </div>
      )}
    </ModalWrapper>
  );
};

export default CreateTest;
