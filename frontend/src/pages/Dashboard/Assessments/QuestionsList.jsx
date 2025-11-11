import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TableComponent, Button } from "../../../components/index";
import { create } from "../../../api/testAttempt";
import { Rules } from "./index";
import { toast } from "react-toastify";
import { getUserId } from "../../../utils";
const QuestionsList = () => {
  const { state } = useLocation();
  const test = state?.test;

  const questions = test?.questions || [];
  const correctQuestionIds = test?.correctQuestionIds || [];
  const wrongQuestionIds = test?.wrongQuestionIds || [];
  const title = test?.name || "NA";
  const testId = test?._id;
  let hasCreatedAttempt = false;
  const isAttempted = state?.isAttempted;
  const [rules, setRules] = useState(false);
  const userId = getUserId();
  const [selectedKey, setSelectedKey] = useState(null);
  const navigate = useNavigate();
  const transformedQuestions = questions.map((item, index) => ({
    id: index + 1,
    ...item,
  }));

  const createAttempt = async () => {
    try {
      const remainingQuestionIds = transformedQuestions.map(
        (item) => item?._id
      );
      const values = {
        userId,
        testId,
        remainingQuestionIds,
      };
      await create(values);
    } catch (err) {
      toast.error(err.message || "testAttempt creation failed");
    }
  };

  const handleClick = (row) => {
    navigate("/dashboard/TestLayout", {
      state: { question: row, language: test?.language, test: test },
    });
  };

  useEffect(() => {
    if (!isAttempted && !hasCreatedAttempt) {
      hasCreatedAttempt = true;
      createAttempt();
    }
  }, []);

  const columns = [
    {
      key: "id",
      label: "S.No",
    },
    {
      key: "questionText",
      label: "Question",
    },

    {
      key: "action",
      label: "Action",
      render: (row) => {
        let id = row._id;
        let btnClass = "bg-yellow-500 hover:bg-yellow-600";
        let btnText = "Remaining";
        let isDisabled = false;

        if (correctQuestionIds.includes(id) || wrongQuestionIds.includes(id)) {
          const isCorrect = correctQuestionIds.includes(id);
          btnClass = isCorrect
            ? "bg-green-500 hover:bg-green-600"
            : "bg-red-500 hover:bg-red-600";
          btnText = isCorrect ? "Correct" : "Wrong";
          isDisabled = true;
        }

        return (
          <Button
            className={`text-white font-medium px-3 py-1 rounded ${btnClass}`}
            disabled={isDisabled}
            onClick={() => handleClick(row)}
          >
            {btnText}
          </Button>
        );
      },
    },
  ];

  return (
    <div className="py-12 px-4 md:w-full w-screen">
      <h2 className="text-2xl font-bold text-center md:mb-4 mb-2">{title}</h2>
      {/* 🔽 Rules link below title */}
      <div
        className="md:text-lg text-base text-red-600 font-semibold mb-5 text-center cursor-pointer hover:text-red-700"
        onClick={() => setRules(true)}
      >
        🔍 Please click to view test rules
      </div>
      <TableComponent
        columns={columns}
        rows={transformedQuestions}
        selectedKey={selectedKey}
        setSelectedKey={setSelectedKey}
      />

      {rules && <Rules onClose={() => setRules(false)} />}
    </div>
  );
};

export default QuestionsList;
