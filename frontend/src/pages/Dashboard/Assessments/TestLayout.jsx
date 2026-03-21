import React, { useState } from "react";
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
import { update } from "../../../api/testAttempt";
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

  const [code, setCode] = useState(getComment(language));

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
      console.log("Starting code execution...");
      console.log("Language:", language);
      console.log("Code:", code);
      console.log("Sample Input:", question?.sampleInput);

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

      console.log("Submission response:", submission.data);

      const token = submission.data.token;
      console.log("Token:", token);

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
        console.log("Result status:", result.status);

        if (result.status.id <= 2) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } else {
          break;
        }
      }

      console.log("Final result:", result);

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
        console.log("Setting hasRunCode to true");
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
    console.log("Submit button clicked!");
    console.log("hasRunCode:", hasRunCode);
    
    // Show warning toast if code hasn't been run
    if (!hasRunCode) {
      toast.warn("Please run your code first before submitting");
      return;
    }
    
    console.log("output:", output);
    console.log("expectedOutput:", question?.expectedOutput);
    console.log("test._id:", test?._id);
    
    try {
      const isCorrect = output.trim() === question?.expectedOutput.trim();
      console.log("isCorrect:", isCorrect);
      
      const values = {
        questionId: question?._id,
        flag: isCorrect,
      };
      console.log("Submitting values:", values);
      
      const response = await update(test?._id, values);
      console.log("Update response:", response);
      
      const { statusCode } = response;
      if (statusCode === 200) {
        setScore(isCorrect ? 10 : 0);
      }
      await delay(3000);
      navigateTo(navigate, ROUTES.DASHBOARD + "/assessments");
    } catch (err) {
      console.error("Submit error:", err);
      alert(err?.message || "Test attempt update failed");
    }
  };
  return (
    <div className="h-full  py-12  px-6  flex flex-col  w-full">
      {/* Sample Input/Output */}
      <div className="">
        <h2 className="text-lg font-semibold mb-4 text-red-500">
          {"Que : " + question?.questionText}
        </h2>
        <h2 className="text-sm font-semibold mb-1">Sample Test Case</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium mb-1">Input:</p>
            <pre className="bg-gray-100 p-2 rounded">
              {question?.sampleInput || "NA"}
            </pre>
          </div>
          <div>
            <p className="font-medium mb-1">Expected Output:</p>
            <pre className="bg-gray-100 p-2 rounded">
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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          onClick={runCode}
          disabled={loading}
        >
         Run Code
        </Button>
        <Button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
          onClick={submitCode}
        >
          Submit Output
        </Button>
      </div>
      {/* Output Display */}
      <div className=" mt-5">
        <h2 className="text-sm font-semibold mb-3">Output</h2>
        <pre className="bg-gray-100 p-3 rounded whitespace-pre-wrap ">
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
