import React, { useState, useEffect } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { JUDGE_API_KEY, JUDGE_HOST, JUDGE_BASE_URL } from "../../../constants";
import {
  CalculateCode,
  GetEditorLang,
  getComment,
  Button,
} from "../../../components";
import { update, getById } from "../../../api/testAttempt";
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

  const [code, setCode] = useState(getComment(language));

  // Track submission count per question
  const [questionSubmissionCounts, setQuestionSubmissionCounts] = useState({});

  // Fetch existing submission counts when component loads
  useEffect(() => {
    const fetchSubmissionCounts = async () => {
      if (test?._id) {
        try {
          const response = await getById(attemptId);
          if (response.success && response.data?.questionSubmissionCounts) {
            setQuestionSubmissionCounts(response.data.questionSubmissionCounts);
          }
        } catch (err) {
          console.error("Error fetching submission counts:", err);
        }
      }
    };
    fetchSubmissionCounts();
  }, [test?._id]);

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
        }
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
          }
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
      setQuestionSubmissionCounts(prev => ({
        ...prev,
        [questionId]: submissionCount
      }));
      
      const values = {
        questionId: question?._id,
        flag: isCorrect,
        submissionCount: submissionCount,
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
  return (
    <div className="h-full  py-12  px-6  flex flex-col  w-full">
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
    </div>
  );
};

export default TestLayout;
