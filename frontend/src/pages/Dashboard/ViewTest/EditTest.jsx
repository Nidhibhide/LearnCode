import { useEffect, useRef, useState } from "react";
import { edit, previewQuestions } from "../../../api/test";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  ModalWrapper,
  FormWrapper,
  InputField,
  Button,
  ConfirmationDialog,
} from "../../../components/index";
import {
  stringValidator,
  selectValidator,
  integerValidator,
} from "../../../validation/GlobalValidation";
import { ROUTES, SUPPORTED_LANGUAGES, TEST_LEVELS } from "../../../constants";
import {
  navigateTo,
  delay,
  handleApiResponse,
  handleApiError,
} from "../../../utils";
import {
  downloadSampleQuestionsCsv,
  parseQuestionsCsv,
  MAX_IMPORT_QUESTIONS,
} from "../../../utils/parseQuestionsCsv";
import * as Yup from "yup";
import { Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import { MdChevronLeft, MdChevronRight, MdDelete } from "react-icons/md";

const fieldClass =
  "w-full md:py-2.5 md:px-3 py-2 px-2 rounded-lg border border-[#6B7280] bg-surface text-textPrimary text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary";

const questionEditorFieldClass =
  "w-full py-2.5 px-3 rounded-lg border border-[#6B7280] bg-surface text-textPrimary text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary";

const questionFieldClass = `${questionEditorFieldClass} resize-none min-h-[100px]`;

const questionLabelClass =
  "text-base md:text-lg font-semibold text-textPrimary";

const sourceCardClass = (active) =>
  `flex-1 rounded-xl border-2 p-3 text-left transition ${
    active
      ? "border-primary bg-primary/5"
      : "border-border bg-surfaceAlt hover:border-borderDark"
  }`;

function EditTest() {
  const { testId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const test = state?.test || {};
  const [isOpen, setIsOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [tab, setTab] = useState("details"); // details | questions
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [addSource, setAddSource] = useState("ai");
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState(null);
  const busy = adding || saving;
  const formValuesRef = useRef({
    name: test?.name || "",
    language: test?.language || "",
    level: test?.level || "",
  });
  const baselineRef = useRef(null);

  const normalizeQuestions = (list) =>
    (list || []).map((q) => ({
      _id: q._id || null,
      questionText: (q.questionText || "").trim(),
      sampleInput: (q.sampleInput || "").trim(),
      expectedOutput: (q.expectedOutput || "").trim(),
    }));

  const isDirty = () => {
    const baseline = baselineRef.current;
    if (!baseline) return false;
    const values = formValuesRef.current || {};
    if (
      (values.name || "") !== baseline.name ||
      (values.language || "") !== baseline.language ||
      (values.level || "") !== baseline.level
    ) {
      return true;
    }
    return (
      JSON.stringify(normalizeQuestions(questions)) !== baseline.questions
    );
  };

  const closeEditor = () => {
    setDiscardOpen(false);
    setConfirmSaveOpen(false);
    setIsOpen(false);
    navigateTo(navigate, ROUTES.DASHBOARD + "/viewTest");
  };

  const handleOpenChange = (open) => {
    if (open) {
      setIsOpen(true);
      return;
    }
    if (busy) {
      setIsOpen(true);
      return;
    }
    if (isDirty()) {
      setDiscardOpen(true);
      setIsOpen(true);
      return;
    }
    closeEditor();
  };

  useEffect(() => {
    if (test && testId) {
      const mapped = (test.questions || []).map((q) => ({
        _id: q._id,
        questionText: q.questionText || "",
        sampleInput: q.sampleInput || "",
        expectedOutput: q.expectedOutput || "",
      }));
      setIsOpen(true);
      setQuestions(mapped);
      setCurrentIndex(0);
      setShowAdd(false);
      setTab("details");
      formValuesRef.current = {
        name: test?.name || "",
        language: test?.language || "",
        level: test?.level || "",
      };
      baselineRef.current = {
        name: test?.name || "",
        language: test?.language || "",
        level: test?.level || "",
        questions: JSON.stringify(normalizeQuestions(mapped)),
      };
    }
  }, [test, testId]);

  const detailsSchema = Yup.object().shape({
    name: stringValidator("Test name", 3, 100, true),
    language: selectValidator("Language", SUPPORTED_LANGUAGES, true),
    level: selectValidator("Level", TEST_LEVELS, true),
    addCount: integerValidator("Questions to add", 1, 5, false),
  });

  const current = questions[currentIndex] || null;
  const total = questions.length;

  const handleQuestionChange = (field, value) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === currentIndex ? { ...q, [field]: value } : q
      )
    );
  };

  const handleDeleteCurrent = () => {
    if (questions.length <= 1) {
      toast.error("At least one question is required.");
      return;
    }
    setQuestions((prev) => prev.filter((_, i) => i !== currentIndex));
    setCurrentIndex((prev) => Math.max(0, Math.min(prev, questions.length - 2)));
  };

  const validateQuestions = () => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q?.questionText?.trim()) {
        toast.error(`Question ${i + 1}: Question is required`);
        setTab("questions");
        setCurrentIndex(i);
        return false;
      }
      if (!q?.expectedOutput?.trim()) {
        toast.error(`Question ${i + 1}: Expected output is required`);
        setTab("questions");
        setCurrentIndex(i);
        return false;
      }
    }
    return true;
  };

  const handleAddAi = async (formikValues) => {
    try {
      if (busy) return;
      const count = Number(formikValues.addCount || 0);
      if (!count || count < 1 || count > 5) {
        toast.error("Enter 1 to 5 questions to generate.");
        return;
      }
      if (questions.length + count > MAX_IMPORT_QUESTIONS) {
        toast.error(`You can have at most ${MAX_IMPORT_QUESTIONS} questions.`);
        return;
      }

      setAdding(true);
      const response = await previewQuestions({
        language: formikValues.language,
        level: formikValues.level,
        numOfQuestions: count,
      });
      const { status, data } = handleApiResponse(response, {
        showSuccessToast: false,
      });
      if (status === 200 && Array.isArray(data)) {
        const startIndex = questions.length;
        setQuestions((prev) => [
          ...prev,
          ...data.map((q) => ({
            questionText: q.questionText || "",
            sampleInput: q.sampleInput || "",
            expectedOutput: q.expectedOutput || "",
          })),
        ]);
        setCurrentIndex(startIndex);
        setShowAdd(false);
        toast.success("Question added. Click Update Test to save.");
      }
    } catch (err) {
      handleApiError(err, "Failed to generate questions");
    } finally {
      setAdding(false);
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
      if (busy) return;
      setAdding(true);

      await detailsSchema.validate(
        { ...formikValues, addCount: formikValues.addCount || 1 },
        { abortEarly: true }
      );

      const text = await file.text();
      const result = parseQuestionsCsv(text);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      if (questions.length + result.questions.length > MAX_IMPORT_QUESTIONS) {
        toast.error(`You can have at most ${MAX_IMPORT_QUESTIONS} questions.`);
        return;
      }

      const startIndex = questions.length;
      setQuestions((prev) => [...prev, ...result.questions]);
      setCurrentIndex(startIndex);
      setShowAdd(false);
      toast.success("Imported. Click Update Test to save.");
    } catch (err) {
      toast.error(err?.message || "Please fill Name, Language, and Level first");
    } finally {
      setAdding(false);
    }
  };

  const requestSave = async (values) => {
    if (busy) return;
    if (!validateQuestions()) return;
    setPendingValues(values);
    setConfirmSaveOpen(true);
  };

  const handleSave = async () => {
    if (!pendingValues || saving) return;
    try {
      setConfirmSaveOpen(false);
      setSaving(true);

      const cleanedQuestions = questions.map((q) => ({
        ...(q._id ? { _id: q._id } : {}),
        questionText: q.questionText.trim(),
        sampleInput: (q.sampleInput || "").trim(),
        expectedOutput: q.expectedOutput.trim(),
      }));

      const response = await edit(testId, {
        name: pendingValues.name,
        language: pendingValues.language,
        level: pendingValues.level,
        questions: cleanedQuestions,
      });

      const { status } = handleApiResponse(response);
      if (status === 200 || status === 201) {
        await delay(2000);
        navigateTo(navigate, ROUTES.DASHBOARD + "/viewTest");
      }
    } catch (err) {
      handleApiError(err, "test editing failed");
    } finally {
      setSaving(false);
      setPendingValues(null);
    }
  };

  return (
    <>
      <ModalWrapper
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        title="Edit Test"
        size="5xl"
        navigateOnClose={false}
        classNames={{ header: "pb-1", body: "pt-1" }}
      >
        <FormWrapper
          initialValues={{
            name: test?.name || "",
            language: test?.language || "",
            level: test?.level || "",
            addCount: 1,
          }}
          validationSchema={detailsSchema}
          onSubmit={requestSave}
        >
          {({ handleSubmit, values }) => {
            formValuesRef.current = {
              name: values.name || "",
              language: values.language || "",
              level: values.level || "",
            };
            return (
            <div className="flex flex-col gap-4">
              <div className="flex w-full border-b border-border">
                <button
                  type="button"
                  onClick={() => setTab("details")}
                  className={`flex-1 py-2.5 text-sm md:text-base font-semibold transition border-b-2 ${
                    tab === "details"
                      ? "text-primary border-primary"
                      : "text-textSecondary border-transparent hover:text-textPrimary"
                  }`}
                >
                  Details
                </button>
                <button
                  type="button"
                  onClick={() => setTab("questions")}
                  className={`flex-1 py-2.5 text-sm md:text-base font-semibold transition border-b-2 ${
                    tab === "questions"
                      ? "text-primary border-primary"
                      : "text-textSecondary border-transparent hover:text-textPrimary"
                  }`}
                >
                  Questions ({total})
                </button>
              </div>

              {tab === "details" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Name of Test"
                    name="name"
                    type="text"
                    placeholder="Enter test name"
                  />
                  <div className="flex flex-col space-y-1">
                    <p className="md:text-lg text-base font-medium">
                      No of Questions
                    </p>
                    <div className="md:py-3 md:px-4 py-2 px-2 rounded-lg border border-borderDark bg-surfaceAlt text-textSecondary w-full">
                      {total}
                    </div>
                  </div>
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
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-1 w-full max-w-sm mx-auto">
                    <button
                      type="button"
                      title="Previous question"
                      aria-label="Previous question"
                      onClick={() =>
                        setCurrentIndex((i) => Math.max(0, i - 1))
                      }
                      disabled={busy || total === 0 || currentIndex <= 0}
                      className={`p-2 rounded-lg border border-border transition shrink-0 ${
                        busy || total === 0 || currentIndex <= 0
                          ? "text-textMuted opacity-50 cursor-not-allowed"
                          : "text-textPrimary hover:bg-border/40"
                      }`}
                    >
                      <MdChevronLeft size={22} />
                    </button>
                    <p className="flex-1 text-center text-base md:text-lg font-semibold text-primary truncate px-1">
                      {total === 0
                        ? "No questions"
                        : `Question ${currentIndex + 1} of ${total}`}
                    </p>
                    <button
                      type="button"
                      title="Next question"
                      aria-label="Next question"
                      onClick={() =>
                        setCurrentIndex((i) => Math.min(total - 1, i + 1))
                      }
                      disabled={
                        busy || total === 0 || currentIndex >= total - 1
                      }
                      className={`p-2 rounded-lg border border-border transition shrink-0 ${
                        busy || total === 0 || currentIndex >= total - 1
                          ? "text-textMuted opacity-50 cursor-not-allowed"
                          : "text-textPrimary hover:bg-border/40"
                      }`}
                    >
                      <MdChevronRight size={22} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {current ? (
                      <>
                        <div className="flex flex-col space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <label className={questionLabelClass}>
                              Question
                            </label>
                            <button
                              type="button"
                              title="Delete this question"
                              aria-label="Delete this question"
                              onClick={handleDeleteCurrent}
                              disabled={busy || total <= 1}
                              className={`p-2 rounded-lg border border-border transition shrink-0 ${
                                busy || total <= 1
                                  ? "text-textMuted opacity-50 cursor-not-allowed"
                                  : "text-error hover:bg-errorBg"
                              }`}
                            >
                              <MdDelete size={18} />
                            </button>
                          </div>
                          <textarea
                            rows={4}
                            value={current.questionText || ""}
                            onChange={(e) =>
                              handleQuestionChange(
                                "questionText",
                                e.target.value
                              )
                            }
                            disabled={busy}
                            className={questionFieldClass}
                            placeholder="Enter question"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="flex flex-col space-y-1.5">
                            <label className={questionLabelClass}>
                              Sample input
                            </label>
                            <input
                              type="text"
                              value={current.sampleInput || ""}
                              onChange={(e) =>
                                handleQuestionChange(
                                  "sampleInput",
                                  e.target.value
                                )
                              }
                              disabled={busy}
                              className={questionEditorFieldClass}
                              placeholder="Optional"
                            />
                          </div>
                          <div className="flex flex-col space-y-1.5">
                            <label className={questionLabelClass}>
                              Expected output
                            </label>
                            <input
                              type="text"
                              value={current.expectedOutput || ""}
                              onChange={(e) =>
                                handleQuestionChange(
                                  "expectedOutput",
                                  e.target.value
                                )
                              }
                              disabled={busy}
                              className={questionEditorFieldClass}
                              placeholder="Required"
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-textSecondary">
                        No questions yet. Click Add questions to create some.
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    {!showAdd ? (
                      <div className="flex flex-col items-center gap-2 pt-1">
                        <div className="flex items-center gap-3 w-full">
                          <span className="flex-1 border-t border-border" />
                          <span className="text-sm md:text-base font-semibold uppercase tracking-wide text-primary">
                            OR
                          </span>
                          <span className="flex-1 border-t border-border" />
                        </div>
                        <p className="text-base md:text-lg font-medium text-textSecondary text-center">
                          Want to add new questions?{" "}
                          <button
                            type="button"
                            onClick={() => setShowAdd(true)}
                            disabled={busy}
                            className="text-primary font-semibold underline underline-offset-2 hover:opacity-80 disabled:opacity-50"
                          >
                            Add questions
                          </button>
                        </p>
                      </div>
                    ) : (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setShowAdd(false)}
                          disabled={busy}
                          className="text-sm font-bold text-textSecondary hover:text-textPrimary underline underline-offset-2 disabled:opacity-50"
                        >
                          Hide
                        </button>
                      </div>
                    )}

                    {showAdd ? (
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            type="button"
                            className={sourceCardClass(addSource === "ai")}
                            onClick={() => setAddSource("ai")}
                            disabled={busy}
                          >
                            <p className="font-semibold text-base md:text-lg text-textPrimary">
                              Generate with AI
                            </p>
                            <p className="text-xs md:text-sm text-textSecondary mt-1">
                              Add new AI questions
                            </p>
                          </button>
                          <button
                            type="button"
                            className={sourceCardClass(addSource === "csv")}
                            onClick={() => setAddSource("csv")}
                            disabled={busy}
                          >
                            <p className="font-semibold text-base md:text-lg text-textPrimary">
                              Import from CSV
                            </p>
                            <p className="text-xs md:text-sm text-textSecondary mt-1">
                              Append from file
                            </p>
                          </button>
                        </div>

                        {addSource === "ai" ? (
                          <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
                            <div className="flex-1 flex flex-col space-y-1.5">
                              <label
                                htmlFor="addCount"
                                className={questionLabelClass}
                              >
                                Questions to add
                              </label>
                              <Field
                                id="addCount"
                                name="addCount"
                                type="number"
                                min={1}
                                max={5}
                                placeholder="1–5"
                                disabled={busy}
                                className={questionEditorFieldClass}
                                onKeyDown={(e) => {
                                  if (["-", "+", "e", "E"].includes(e.key)) {
                                    e.preventDefault();
                                  }
                                }}
                              />
                              <ErrorMessage
                                name="addCount"
                                component="div"
                                className="text-sm text-error"
                              />
                            </div>
                            <Button
                              type="button"
                              width="w-full sm:w-auto"
                              className="bg-black text-white py-3 px-6 font-medium rounded-xl mb-0"
                              loading={adding}
                              loadingText="Generating..."
                              onClick={() => handleAddAi(values)}
                            >
                              Add questions
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <p className="text-sm md:text-base text-textPrimary">
                              <span className="font-semibold">
                                Need a template?
                              </span>{" "}
                              <button
                                type="button"
                                onClick={downloadSampleQuestionsCsv}
                                disabled={busy}
                                className="text-primary font-semibold underline underline-offset-2 hover:opacity-80 disabled:opacity-50"
                              >
                                Download sample CSV
                              </button>
                            </p>
                            <Button
                              type="button"
                              width="w-full sm:w-auto"
                              className="bg-black text-white py-3 px-6 font-medium rounded-xl mb-0"
                              loading={adding}
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
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              )}

              <div className="flex justify-center">
                <Button
                  loading={saving}
                  onClick={handleSubmit}
                  loadingText="Updating..."
                  width="w-auto min-w-[160px]"
                  className="bg-black text-white py-3 px-8 font-medium rounded-xl mb-2 md:mb-4"
                >
                  Update Test
                </Button>
              </div>
            </div>
            );
          }}
        </FormWrapper>
      </ModalWrapper>

      <ConfirmationDialog
        isOpen={confirmSaveOpen}
        onOpenChange={setConfirmSaveOpen}
        title="Save changes?"
        message="If no students started this test, it will be updated. If students already started, a new version will be created and old results will stay safe."
        confirmText="Save"
        cancelText="Cancel"
        onConfirm={handleSave}
        loading={saving}
        navigateOnClose={false}
      />

      <ConfirmationDialog
        isOpen={discardOpen}
        onOpenChange={setDiscardOpen}
        title="Leave without saving?"
        message="You have unsaved changes. If you leave now, they will be lost."
        confirmText="Leave"
        cancelText="Stay"
        onConfirm={closeEditor}
        navigateOnClose={false}
      />
    </>
  );
}

export default EditTest;
