import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  MdOpenInFull,
  MdCloseFullscreen,
  MdDarkMode,
  MdLightMode,
  MdContentCopy,
  MdRestartAlt,
  MdTextDecrease,
  MdTextIncrease,
} from "react-icons/md";
import { FaListUl } from "react-icons/fa";
import { JUDGE_API_KEY, JUDGE_HOST, JUDGE_BASE_URL } from "../../../constants";
import {
  CalculateCode,
  GetEditorLang,
  getComment,
  Button,
  ConfirmationDialog,
} from "../../../components";
import { update, getById, saveCode } from "../../../api/testAttempt";
import { navigateTo, delay, ROUTES } from "../../../utils";

const FONT_MIN = 12;
const FONT_MAX = 24;
const FONT_STEP = 2;

const TestLayout = () => {
  const [output, setOutput] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hasRunCode, setHasRunCode] = useState(false);
  const [score, setScore] = useState(null);
  const { state } = useLocation();
  const test = state?.test;
  const question = state?.question || [];
  const language = test?.language;
  const attemptId = state?.attemptId;
  const questionId = question?._id;

  const [code, setCode] = useState(getComment(language));
  const [customInput, setCustomInput] = useState(
    () => question?.sampleInput || ""
  );
  const [draftReady, setDraftReady] = useState(false);
  const codeRef = useRef(code);
  const saveTimerRef = useRef(null);
  const draftReadyRef = useRef(false);

  useEffect(() => {
    setCustomInput(question?.sampleInput || "");
  }, [questionId, question?.sampleInput]);

  // Track submission count per question
  const [questionSubmissionCounts, setQuestionSubmissionCounts] = useState({});

  // Track fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [editorTheme, setEditorTheme] = useState(() => {
    try {
      return localStorage.getItem("learncode-editor-theme") === "light"
        ? "light"
        : "dark";
    } catch {
      return "dark";
    }
  });
  const [fontSize, setFontSize] = useState(() => {
    try {
      const saved = Number(localStorage.getItem("learncode-editor-font"));
      if (
        Number.isFinite(saved) &&
        saved >= FONT_MIN &&
        saved <= FONT_MAX
      ) {
        return saved;
      }
    } catch {
      /* ignore */
    }
    return 14;
  });

  const monacoTheme = editorTheme === "light" ? "vs" : "vs-dark";

  const persistFontSize = (size) => {
    try {
      localStorage.setItem("learncode-editor-font", String(size));
    } catch {
      /* ignore */
    }
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => {
      const next = Math.max(FONT_MIN, prev - FONT_STEP);
      persistFontSize(next);
      return next;
    });
  };

  const increaseFontSize = () => {
    setFontSize((prev) => {
      const next = Math.min(FONT_MAX, prev + FONT_STEP);
      persistFontSize(next);
      return next;
    });
  };

  const toggleEditorTheme = () => {
    setEditorTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("learncode-editor-theme", next);
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const copyCode = async () => {
    const text = code ?? "";
    if (!text.trim()) {
      toast.warn("Nothing to copy");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Code copied");
    } catch {
      toast.error("Could not copy code");
    }
  };

  const resetCode = () => {
    const starter = getComment(language);
    setCode(starter);
    setHasRunCode(false);
    setOutput("");
    setScore(null);
    toast.success("Code reset");
  };

  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  useEffect(() => {
    draftReadyRef.current = draftReady;
  }, [draftReady]);

  const persistCode = async (codeToSave = codeRef.current) => {
    if (!attemptId || !questionId || typeof codeToSave !== "string") return;
    try {
      await saveCode(attemptId, {
        questionId: String(questionId),
        code: codeToSave,
      });
    } catch (err) {
      console.error("Error saving code draft:", err);
    }
  };

  // Load submission counts + saved draft code
  useEffect(() => {
    setDraftReady(false);
    const fetchAttemptData = async () => {
      if (!attemptId || !questionId) {
        setDraftReady(true);
        return;
      }
      try {
        const response = await getById(attemptId);
        if (response.success && response.data) {
          if (response.data.questionSubmissionCounts) {
            setQuestionSubmissionCounts(response.data.questionSubmissionCounts);
          }
          const saved =
            response.data.savedCode?.[String(questionId)] ??
            response.data.savedCode?.[questionId];
          if (typeof saved === "string" && saved.length > 0) {
            setCode(saved);
          }
        }
      } catch (err) {
        console.error("Error fetching attempt data:", err);
      } finally {
        setDraftReady(true);
      }
    };
    fetchAttemptData();
  }, [attemptId, questionId]);

  // Auto-save draft while typing (also covers sidebar leave)
  useEffect(() => {
    if (!attemptId || !questionId || !draftReady) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      persistCode(code);
    }, 1000);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [code, attemptId, questionId, draftReady]);

  // Flush latest draft on leave/unmount so sidebar navigation keeps code
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (draftReadyRef.current) {
        persistCode(codeRef.current);
      }
    };
  }, [attemptId, questionId]);

  const runCode = async () => {
    // Check if code is empty or just placeholder comment
    const isPlaceholder = /^\s*(#|\/\/)\s*Write your code here\s*$/;
    if (!code?.trim() || isPlaceholder.test(code)) {
      setOutput("Please write something");
      setHasRunCode(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setOutput("");

    try {
      // Submit code to Judge0
      const submission = await axios.post(
        `${JUDGE_BASE_URL}/submissions?base64_encoded=false&wait=false`,
        {
          source_code: code,
          stdin: customInput,
          language_id: CalculateCode(language),
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key": JUDGE_API_KEY,
            "X-RapidAPI-Host": JUDGE_HOST,
          },
        },
      );

      const token = submission.data.token;

      // Poll for result
      let result;
      while (true) {
        const response = await axios.get(
          `${JUDGE_BASE_URL}/submissions/${token}?base64_encoded=false`,
          {
            headers: {
              "X-RapidAPI-Key": JUDGE_API_KEY,
              "X-RapidAPI-Host": JUDGE_HOST,
            },
          },
        );

        result = response.data;

        if (result.status.id <= 2) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } else {
          break;
        }
      }

      // Set output based on result
      if (result.stdout) {
        setOutput(result.stdout);
      } else if (result.stderr) {
        setOutput(result.stderr);
      } else if (result.compile_output) {
        setOutput(result.compile_output);
      } else {
        setOutput("Please write something");
      }

      if (result.stdout || result.stderr || result.compile_output) {
        setHasRunCode(true);
      }
    } catch (error) {
      console.error("Run code error:", error);
      setOutput(error.message);
    } finally {
      setLoading(false);
    }
  };

  const submitCode = async () => {
    // Show warning toast if code hasn't been run
    if (!hasRunCode) {
      toast.warn("Please run your code first before submitting");
      return;
    }

    try {
      const isCorrect = output.trim() === question?.expectedOutput.trim();

      // Get current submission count for this question
      const questionId = question?._id;
      const currentCount = questionSubmissionCounts[questionId] || 0;
      const submissionCount = currentCount + 1;

      // Update local state
      setQuestionSubmissionCounts((prev) => ({
        ...prev,
        [questionId]: submissionCount,
      }));

      const values = {
        questionId: question?._id,
        flag: isCorrect,
        submissionCount: submissionCount,
        code, // keep latest draft saved with submit too
      };

      const response = await update(attemptId, values);

      const { statusCode } = response;
      if (statusCode === 200) {
        setScore(isCorrect ? 10 : 0);
        // Show message - for correct navigate after delay, for wrong hide result after delay
        if (isCorrect) {
          toast.success("Correct! Well done!");
          await delay(3000);
          navigateTo(navigate, ROUTES.DASHBOARD + "/assessments");
        } else {
          toast.warn("Incorrect - you can try again!");
          // Hide result display after 3 seconds but stay on same question
          await delay(3000);
          setScore(null);
        }
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert(err?.message || "Test attempt update failed");
    }
  };

  const handleFullScreen = () => {
    const element = document.getElementById("test-area");
    if (!document.fullscreenElement) {
      element.requestFullscreen();
      setIsFullscreen(true);
    } else {
       document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleConfirmLeaveToQuestionList = async () => {
    await persistCode();
    setLeaveOpen(false);
    navigate("/dashboard/questionsList", {
      state: {
        test,
        attemptId,
        isAttempted: true,
      },
    });
  };

  return (
    <div
      id="test-area"
      className="min-h-full pt-4 pb-10 px-6 flex flex-col w-full bg-white"
    >
      {/* Sample Input/Output */}
      <div className="">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h2 className="text-lg md:text-xl font-semibold text-error leading-snug flex-1 min-w-0">
            {"Que : " + question?.questionText}
          </h2>
          <button
            type="button"
            onClick={() => setLeaveOpen(true)}
            className="flex items-center gap-2 shrink-0 bg-transparent text-primary hover:text-primaryDark font-semibold text-base md:text-lg py-0 px-0 transition-colors"
          >
            <FaListUl size={16} />
            Question List
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-base md:text-lg font-semibold mb-1.5">
              Sample input
            </p>
            <pre className="bg-surfaceAlt p-3 md:p-4 rounded-lg text-base md:text-lg whitespace-pre-wrap break-words">
              {question?.sampleInput || "NA"}
            </pre>
          </div>
          <div>
            <p className="text-base md:text-lg font-semibold mb-1.5">
              Expected output
            </p>
            <pre className="bg-surfaceAlt p-3 md:p-4 rounded-lg text-base md:text-lg whitespace-pre-wrap break-words">
              {question?.expectedOutput || "NA"}
            </pre>
          </div>
        </div>
      </div>
      {/* Code Editor */}
      <div className=" mt-4">
        <div className="flex items-center justify-between gap-3 mb-2">
          <h2 className="text-base md:text-lg font-semibold">Code Editor</h2>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={decreaseFontSize}
              disabled={fontSize <= FONT_MIN}
              aria-label="Decrease font size"
              className="inline-flex items-center justify-center p-1.5 rounded-md text-textSecondary hover:text-textPrimary hover:bg-surfaceAlt transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              <MdTextDecrease size={20} />
            </button>
            <button
              type="button"
              onClick={increaseFontSize}
              disabled={fontSize >= FONT_MAX}
              aria-label="Increase font size"
              className="inline-flex items-center justify-center p-1.5 rounded-md text-textSecondary hover:text-textPrimary hover:bg-surfaceAlt transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              <MdTextIncrease size={20} />
            </button>
            <button
              type="button"
              onClick={resetCode}
              aria-label="Reset code"
              className="inline-flex items-center justify-center p-1.5 rounded-md text-textSecondary hover:text-textPrimary hover:bg-surfaceAlt transition"
            >
              <MdRestartAlt size={20} />
            </button>
            <button
              type="button"
              onClick={copyCode}
              aria-label="Copy code"
              className="inline-flex items-center justify-center p-1.5 rounded-md text-textSecondary hover:text-textPrimary hover:bg-surfaceAlt transition"
            >
              <MdContentCopy size={18} />
            </button>
            <button
              type="button"
              onClick={toggleEditorTheme}
              aria-label={
                editorTheme === "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
              className="inline-flex items-center justify-center p-1.5 rounded-md text-textSecondary hover:text-textPrimary hover:bg-surfaceAlt transition"
            >
              {editorTheme === "dark" ? (
                <MdDarkMode size={20} />
              ) : (
                <MdLightMode size={20} />
              )}
            </button>
          </div>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <Editor
            height="420px"
            language={GetEditorLang(language)}
            theme={monacoTheme}
            value={code}
            onChange={(value) => setCode(value)}
            options={{
              fontSize,
              minimap: { enabled: false },
            }}
          />
        </div>
      </div>

      {/* Custom Input */}
      <div className="mt-4">
        <div className="flex items-center justify-between gap-3 mb-1.5">
          <h2 className="text-base md:text-lg font-semibold text-textPrimary">
            Custom input
          </h2>
          <button
            type="button"
            onClick={() => setCustomInput(question?.sampleInput || "")}
            className="text-sm md:text-base font-bold text-primary hover:text-primaryDark transition-colors"
          >
            Use sample
          </button>
        </div>
        <textarea
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          rows={2}
          placeholder="Enter input for Run Code"
          className="w-full py-2 px-3 rounded-md border border-[#6B7280] bg-surface text-textPrimary text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-y min-h-[56px] max-h-[200px]"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-5 justify-end">
        <Button
          className="bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-primaryDark text-sm md:text-base"
          onClick={runCode}
          disabled={loading}
        >
          Run Code
        </Button>
        <Button
          className="bg-success text-white px-4 py-2.5 rounded-lg hover:bg-success text-sm md:text-base"
          onClick={submitCode}
        >
          Submit Output
        </Button>
      </div>
      {/* Output Display */}
      <div className=" mt-5">
        <h2 className="text-base md:text-lg font-semibold mb-3">Output</h2>
        <pre className="bg-surfaceAlt p-3 md:p-4 rounded-lg text-base md:text-lg whitespace-pre-wrap break-words min-h-[96px]">
          {output ? output : "No output generated yet..."}
        </pre>
      </div>
      {/* Score Display */}
      {score !== null && (
        <div className="mt-4 text-base font-medium">
          Result: {score === 10 ? "✅ Correct" : "❌ Incorrect"} | Score:{" "}
          {score}
        </div>
      )}
      {/* Fullscreen Button — in page flow below Output */}
      <div className="mt-3 mb-2 flex justify-end text-primary cursor-pointer">
        {isFullscreen ? (
          <MdCloseFullscreen size={24} onClick={handleFullScreen} />
        ) : (
          <MdOpenInFull size={24} onClick={handleFullScreen} />
        )}
      </div>

      <ConfirmationDialog
        isOpen={leaveOpen}
        onOpenChange={setLeaveOpen}
        title="Leave test?"
        message="Your code for this question is saved. Submitted answers are kept. You can continue later from Ongoing."
        onConfirm={handleConfirmLeaveToQuestionList}
        confirmText="Leave"
        cancelText="Stay"
        confirmColor="danger"
        navigateOnClose={false}
      />
    </div>
  );
};

export default TestLayout;
