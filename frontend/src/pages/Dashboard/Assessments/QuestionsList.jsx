import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TableComponent, Button } from "../../../components/index";
import { create } from "../../../api/testAttempt";
import { Rules } from "./index";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
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
  const userId = useSelector((state) => state.user?._id);
  const [selectedKey, setSelectedKey] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
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
      const response = await create(values);
      if (response.data?._id) {
        return response.data._id;
      }
      return null;
    } catch (err) {
      toast.error(err.message || "testAttempt creation failed");
    }
  };

  const handleClick = (row) => {
    navigate("/dashboard/TestLayout", {
      state: { question: row, language: test?.language, test: test, attemptId },
    });
  };

  useEffect(() => {
    const initAttempt = async () => {
      if (!isAttempted && !hasCreatedAttempt) {
        hasCreatedAttempt = true;
        const id = await createAttempt();
        setAttemptId(id);
      }
    };
    initAttempt();
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
        let btnClass = "bg-warning hover:bg-warning";
        let btnText = "Remaining";
        let isDisabled = false;

        if (correctQuestionIds.includes(id) || wrongQuestionIds.includes(id)) {
          const isCorrect = correctQuestionIds.includes(id);
          btnClass = isCorrect
            ? "bg-success hover:bg-success"
            : "bg-error hover:bg-error";
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
    <div className="py-12 px-4 md:w-full">
      <h2 className="text-2xl font-bold text-center md:mb-4 mb-2">{title}</h2>
      {/* 🔽 Rules link below title */}
      <div
        className="md:text-lg text-base text-error font-semibold mb-5 text-center cursor-pointer hover:text-error"
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
