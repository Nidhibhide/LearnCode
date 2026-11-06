import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MdOpenInFull, MdCloseFullscreen } from "react-icons/md";
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
  const [draftReady, setDraftReady] = useState(false);
  const codeRef = useRef(code);
  const saveTimerRef = useRef(null);
  const draftReadyRef = useRef(false);

  // Track submission count per question
  const [questionSubmissionCounts, setQuestionSubmissionCounts] = useState({});

  // Track fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);

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
          stdin: question?.sampleInput,
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
      className="h-full py-12 px-6 flex flex-col w-full bg-white"
    >
      <div className="flex justify-start mb-4">
        <Button
          onClick={() => setLeaveOpen(true)}
          className="flex items-center gap-2 bg-transparent text-textPrimary hover:text-primary font-medium text-base md:text-lg py-2 px-0 mb-0 shadow-none"
        >
          <FaListUl size={16} />
          Question List
        </Button>
      </div>

      {/* Sample Input/Output */}
      <div className="">
        <h2 className="text-lg font-semibold mb-4 text-error">
          {"Que : " + question?.questionText}
        </h2>
        <h2 className="text-sm font-semibold mb-1">Sample Test Case</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium mb-1">Input:</p>
            <pre className="bg-surfaceAlt p-2 rounded">
              {question?.sampleInput || "NA"}
            </pre>
          </div>
          <div>
            <p className="font-medium mb-1">Expected Output:</p>
            <pre className="bg-surfaceAlt p-2 rounded">
              {question?.expectedOutput || "NA"}
            </pre>
          </div>
        </div>
      </div>
      {/* Code Editor */}
      <div className=" mt-4">
        <h2 className="text-sm font-semibold mb-2">Code Editor</h2>
        <div className="border rounded overflow-hidden">
          <Editor
            height="300px"
            language={GetEditorLang(language)}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value)}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
            }}
          />
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex gap-4 mt-5 justify-end">
        <Button
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primaryDark text-sm"
          onClick={runCode}
          disabled={loading}
        >
          Run Code
        </Button>
        <Button
          className="bg-success text-white px-4 py-2 rounded hover:bg-success text-sm"
          onClick={submitCode}
        >
          Submit Output
        </Button>
      </div>
      {/* Output Display */}
      <div className=" mt-5">
        <h2 className="text-sm font-semibold mb-3">Output</h2>
        <pre className="bg-surfaceAlt p-3 rounded whitespace-pre-wrap ">
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
      {/* Fullscreen Button */}
      <div className="fixed bottom-6 right-6 text-primary cursor-pointer">
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
