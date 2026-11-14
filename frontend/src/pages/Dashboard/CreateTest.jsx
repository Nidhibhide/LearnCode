import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ModalWrapper,
  FormWrapper,
  InputField,
  Button,
  ConfirmationDialog,
} from "../../components/index";
import { create, previewQuestions } from "../../api/test";
import * as Yup from "yup";
import { FaArrowsRotate } from "react-icons/fa6";
import { toast } from "react-toastify";
import { handleApiResponse, handleApiError, delay, navigateTo } from "../../utils";
import {
  downloadSampleQuestionsCsv,
  parseQuestionsCsv,
} from "../../utils/parseQuestionsCsv";
import { stringValidator, integerValidator, selectValidator } from "../../validation/GlobalValidation";
import { SUPPORTED_LANGUAGES, TEST_LEVELS, ROUTES } from "../../constants";

const MAX_REGENERATES = 3;

const fieldClass =
  "w-full md:py-2.5 md:px-3 py-2 px-2 rounded-lg border border-[#6B7280] bg-surface text-textPrimary text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary";

const questionFieldClass = `${fieldClass} resize-none min-h-[88px]`;

const sourceCardClass = (active) =>
  `flex-1 rounded-xl border-2 p-3 text-left transition ${
    active
      ? "border-primary bg-primary/5"
      : "border-border bg-surfaceAlt hover:border-borderDark"
  }`;

const CreateTest = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [step, setStep] = useState("form"); // form | preview
  const [questionSource, setQuestionSource] = useState("ai"); // ai | csv
  const [formValues, setFormValues] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [regenerateCount, setRegenerateCount] = useState(0);
  const [confirmRegenerateOpen, setConfirmRegenerateOpen] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);
  const [csvFileName, setCsvFileName] = useState("");
  const formValuesRef = useRef({
    name: "",
    language: "",
    level: "",
    numOfQuestions: "",
  });

  const isDirty = () => {
    if (step === "preview" && questions.length > 0) return true;
    const values = formValuesRef.current || {};
    return Boolean(
      (values.name || "").trim() ||
        values.language ||
        values.level ||
        values.numOfQuestions
    );
  };

  const closeCreator = () => {
    setDiscardOpen(false);
    setConfirmRegenerateOpen(false);
    setIsOpen(false);
    navigateTo(navigate, ROUTES.DASHBOARD + "/viewTest");
  };

  const handleOpenChange = (open) => {
    if (open) {
      setIsOpen(true);
      return;
    }
    if (loading) {
      setIsOpen(true);
      return;
    }
    if (isDirty()) {
      setDiscardOpen(true);
      setIsOpen(true);
      return;
    }
    closeCreator();
  };
  const validationSchema = Yup.object().shape({
    name: stringValidator("Test name", 3, 100, true),
    language: selectValidator("Language", SUPPORTED_LANGUAGES, true),
    level: selectValidator("Level", TEST_LEVELS, true),
    numOfQuestions:
      questionSource === "ai"
        ? integerValidator("Number of questions", 1, 5, true)
        : Yup.mixed().notRequired(),
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

  const goToPreview = (values, nextQuestions) => {
    setFormValues({
      ...values,
      numOfQuestions: nextQuestions.length,
    });
    setQuestions(nextQuestions);
    setRegenerateCount(0);
    setStep("preview");
  };

  // Step 1 (AI): validate form and show question preview
  const handlePreview = async (values) => {
    if (questionSource !== "ai") return;
    try {
      if (loading) return;
      setLoading(true);
      const data = await generatePreview(values);
      if (data) {
        setCsvFileName("");
        goToPreview(values, data);
      }
    } catch (err) {
      handleApiError(err, "Failed to generate questions");
    } finally {
      setLoading(false);
    }
  };

  const handleCsvFile = async (event, formikValues) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast.error("Please upload a CSV file.");
      return;
    }

    try {
      if (loading) return;
      setLoading(true);

      // Validate shared fields before import
      await validationSchema.validate(formikValues, { abortEarly: true });

      const text = await file.text();
      const result = parseQuestionsCsv(text);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      setCsvFileName(file.name);
      goToPreview(formikValues, result.questions);
      toast.success(`${file.name} is imported`);
    } catch (err) {
      toast.error(err?.message || "Please fill Name, Language, and Level first");
    } finally {
      setLoading(false);
    }
  };

  const runRegenerate = async () => {
    if (
      questionSource !== "ai" ||
      !formValues ||
      regenerateCount >= MAX_REGENERATES ||
      loading
    ) {
      return;
    }
    try {
      setConfirmRegenerateOpen(false);
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

  const handleRegenerateClick = () => {
    if (
      questionSource !== "ai" ||
      !formValues ||
      regenerateCount >= MAX_REGENERATES ||
      loading
    ) {
      return;
    }
    setConfirmRegenerateOpen(true);
  };

  const handleQuestionChange = (index, field, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  };

  const validateQuestions = () => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q?.questionText?.trim()) {
        toast.error(`Question ${i + 1}: Question is required`);
        return false;
      }
      if (!q?.expectedOutput?.trim()) {
        toast.error(`Question ${i + 1}: Expected output is required`);
        return false;
      }
    }
    return true;
  };

  // Step 2: create test with reviewed / edited questions
  const handleProceed = async () => {
    if (!formValues || !questions.length || loading) return;
    if (!validateQuestions()) return;

    try {
      setLoading(true);
      const cleanedQuestions = questions.map((q) => ({
        questionText: q.questionText.trim(),
        sampleInput: (q.sampleInput || "").trim(),
        expectedOutput: q.expectedOutput.trim(),
      }));

      const response = await create({
        ...formValues,
        numOfQuestions: cleanedQuestions.length,
        questions: cleanedQuestions,
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
    <>
      <ModalWrapper
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        navigateOnClose={false}
        title={
          step === "preview" ? (
            <span className="flex items-center gap-2 min-w-0 flex-wrap">
              <span>Preview Questions</span>
              {questionSource === "csv" && csvFileName ? (
                <span className="text-primary font-semibold truncate max-w-[min(100%,280px)] md:max-w-md">
                  {csvFileName}
                </span>
              ) : null}
            </span>
          ) : (
            "Create Test"
          )
        }
        size={step === "preview" ? "5xl" : "lg"}
        classNames={
          step === "preview"
            ? { header: "pb-1", body: "pt-1" }
            : {}
        }
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
            {({ handleSubmit, values }) => {
              formValuesRef.current = {
                name: values.name || "",
                language: values.language || "",
                level: values.level || "",
                numOfQuestions: values.numOfQuestions || "",
              };
              return (
              <>
                <div className="flex flex-col space-y-4 mb-6">
                  <InputField
                    label="Name of Test"
                    name="name"
                    type="text"
                    placeholder="Enter test name"
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

                  <div className="flex flex-col space-y-2">
                    <p className="md:text-lg text-base font-medium">
                      How do you want questions?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        className={sourceCardClass(questionSource === "ai")}
                        onClick={() => setQuestionSource("ai")}
                        disabled={loading}
                      >
                        <p className="font-semibold text-sm md:text-base">
                          Generate with AI
                        </p>
                        <p className="text-xs md:text-sm text-textSecondary mt-1">
                          Auto-create questions, then edit
                        </p>
                      </button>
                      <button
                        type="button"
                        className={sourceCardClass(questionSource === "csv")}
                        onClick={() => setQuestionSource("csv")}
                        disabled={loading}
                      >
                        <p className="font-semibold text-sm md:text-base">
                          Import from CSV
                        </p>
                        <p className="text-xs md:text-sm text-textSecondary mt-1">
                          Upload your own question list
                        </p>
                      </button>
                    </div>
                  </div>

                  {questionSource === "ai" ? (
                    <InputField
                      label="No of Questions"
                      name="numOfQuestions"
                      type="number"
                      min={1}
                      max={5}
                      placeholder="Enter No of Questions"
                    />
                  ) : (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <p className="text-base md:text-lg font-semibold text-textPrimary">
                          Upload your questions
                        </p>
                        <p className="text-sm md:text-base text-textPrimary">
                          <span className="font-semibold">Need a template?</span>{" "}
                          <button
                            type="button"
                            onClick={downloadSampleQuestionsCsv}
                            disabled={loading}
                            className="text-primary font-semibold underline underline-offset-2 hover:opacity-80 disabled:opacity-50"
                          >
                            Download sample CSV
                          </button>
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          type="button"
                          width="w-full"
                          className="bg-black text-white py-3 font-medium rounded-xl mb-0"
                          loading={loading}
                          loadingText="Importing..."
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Upload CSV
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".csv,text/csv"
                          className="hidden"
                          onChange={(e) => handleCsvFile(e, values)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {questionSource === "ai" ? (
                  <Button
                    loading={loading}
                    onClick={handleSubmit}
                    loadingText="Generating..."
                    width="w-full"
                  >
                    Preview Questions
                  </Button>
                ) : null}
              </>
              );
            }}
          </FormWrapper>
        ) : (
          <div className="flex flex-col">
            {questionSource === "ai" ? (
              <div className="flex items-center justify-end gap-2 mb-2">
                <span className="text-base md:text-lg font-bold text-error bg-errorBg px-2.5 py-1 rounded-lg whitespace-nowrap">
                  {regeneratesLeft} left
                </span>
                <button
                  type="button"
                  title="Regenerate questions"
                  aria-label="Regenerate questions"
                  onClick={handleRegenerateClick}
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
            ) : null}

            <div className="space-y-5 overflow-y-auto max-h-[70vh] mb-6 pr-1">
              {questions.map((item, index) => (
                <div
                  key={index}
                  className={`w-full space-y-3 ${
                    index > 0 ? "pt-4 border-t border-border" : ""
                  }`}
                >
                  <div className="flex flex-col space-y-1.5">
                    <label className="font-semibold text-sm md:text-base text-textPrimary">
                      Q{index + 1}
                    </label>
                    <textarea
                      rows={3}
                      value={item.questionText || ""}
                      onChange={(e) =>
                        handleQuestionChange(index, "questionText", e.target.value)
                      }
                      disabled={loading}
                      className={questionFieldClass}
                      placeholder="Enter question"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-sm md:text-base font-medium text-textPrimary">
                        Sample input
                      </label>
                      <input
                        type="text"
                        value={item.sampleInput || ""}
                        onChange={(e) =>
                          handleQuestionChange(
                            index,
                            "sampleInput",
                            e.target.value
                          )
                        }
                        disabled={loading}
                        className={`${fieldClass} text-sm md:text-base`}
                        placeholder="Optional"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-sm md:text-base font-medium text-textPrimary">
                        Expected output
                      </label>
                      <input
                        type="text"
                        value={item.expectedOutput || ""}
                        onChange={(e) =>
                          handleQuestionChange(
                            index,
                            "expectedOutput",
                            e.target.value
                          )
                        }
                        disabled={loading}
                        className={`${fieldClass} text-sm md:text-base`}
                        placeholder="Required"
                      />
                    </div>
                  </div>
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

      <ConfirmationDialog
        isOpen={confirmRegenerateOpen}
        onOpenChange={setConfirmRegenerateOpen}
        title="Regenerate questions?"
        message="Regenerate will replace your edits with new AI questions. Continue?"
        confirmText="Regenerate"
        cancelText="Cancel"
        onConfirm={runRegenerate}
        loading={loading}
        navigateOnClose={false}
      />

      <ConfirmationDialog
        isOpen={discardOpen}
        onOpenChange={setDiscardOpen}
        title="Leave without saving?"
        message="You have unsaved changes. If you leave now, they will be lost."
        confirmText="Leave"
        cancelText="Stay"
        onConfirm={closeCreator}
        navigateOnClose={false}
      />
    </>
  );
};

export default CreateTest;
