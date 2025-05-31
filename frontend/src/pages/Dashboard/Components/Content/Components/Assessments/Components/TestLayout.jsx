import React, { useState } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { useLocation, useNavigate } from "react-router-dom";
import { JUDGE_API_KEY, JUDGE_HOST } from "../../../../../../../../config";
import {
  CalculateCode,
  GetEditorLang,
  getComment,
} from "../../../../../../../components/TestLayout";
import { update } from "../../../../../../../api/testAttempt";

const TestLayout = () => {
  const [output, setOutput] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { state } = useLocation();
  const test = state?.test;

  const question = state?.question || [];
  const language = test?.language;

  const [code, setCode] = useState(getComment(language));
  const runCode = async () => {
    setLoading(true);
    setOutput("");

    try {
      // Step 1: Submit code

      const submission = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=false",
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

      // Step 2: Poll for result
      let result;
      while (true) {
        const response = await axios.get(
          `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false`,
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

      if (result.stdout) {
        setOutput(result.stdout);
      } else if (result.stderr) {
        setOutput(result.stderr);
      } else {
        setOutput(result.compile_output || "Unknown error");
      }
    } catch (error) {
      setOutput(error.message);
    } finally {
      setLoading(false);
    }
  };
  const submitCode = async () => {
    try {
      const flag = output.trim() === question?.expectedOutput.trim();
      const values = {
        questionId: question?._id,
        flag,
      };
      const response = await update(test?._id, values);
     
      setTimeout(() => navigate("/dashboard/assessments"), 3000);
    } catch (err) {
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
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          onClick={runCode}
          disabled={loading}
        >
          {loading ? "Running..." : "Run Code"}
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
          onClick={submitCode}
        >
          Submit Output
        </button>
      </div>

      {/* Output Display */}
      <div className=" mt-5">
        <h2 className="text-sm font-semibold mb-3">Output</h2>
        <pre className="bg-gray-100 p-3 rounded whitespace-pre-wrap ">
          {output ? output : "No output generated yet..."}
        </pre>
      </div>
    </div>
  );
};

export default TestLayout;
