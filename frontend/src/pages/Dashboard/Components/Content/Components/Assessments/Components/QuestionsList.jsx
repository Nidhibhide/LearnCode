import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TableComponent } from "../../../../../../../components/index";
import { create } from "../../../../../../../api/testAttempt";

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

  const userId = JSON.parse(localStorage.getItem("data"))?._id;
  const [selectedKey, setSelectedKey] = useState(null);
  const navigate = useNavigate();
  const transformedQuestions = questions.map((item, index) => ({
    id: index + 1,
    ...item,
  }));

  const createAttempt = async () => {
    try {
     
      const remainingQuestionIds = transformedQuestions.map(
        (item, index) => item?._id
      );
      const values = {
        userId: userId,
        testId: testId,
        remainingQuestionIds: remainingQuestionIds,
      };
      const response = await create(values);
    } catch (err) {
      alert(err.message || "testAttempt creation failed");
    }
  };

  const handleClick = (row) => {
    navigate("/dashboard/TestLayout", {
      state: { question: row, language: test?.language,test:test },
    });
  };

  useEffect(() => {
    if (!isAttempted && !hasCreatedAttempt) {
      hasCreatedAttempt = true;
      createAttempt();
    } else {
      console.log("exit");
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
          <button
            className={`text-white font-medium px-3 py-1 rounded ${btnClass}`}
            disabled={isDisabled}
            onClick={() => handleClick(row)}
          >
            {btnText}
          </button>
        );
      },
    },
  ];

  return (
    <div className="py-12 px-4">
      <h2 className="text-2xl font-bold text-center mb-4">{title}</h2>

      <TableComponent
        columns={columns}
        rows={transformedQuestions}
        selectedKey={selectedKey}
        setSelectedKey={setSelectedKey}
      />
    </div>
  );
};

export default QuestionsList;
