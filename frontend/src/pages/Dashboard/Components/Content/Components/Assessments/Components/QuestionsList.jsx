import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { TableComponent } from "../../../../../../../components/index";
import { generateQues } from "../../../../../../../api/ai";

const QuestionsList = () => {
  const { state } = useLocation();
  const test = state?.test || "Not Available";
  const [questions, setQuestions] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);

  const handleGenerateQuestions = async () => {
    try {
      const data = {
        level: test?.level,
        language: test?.language,
        numOfQuestions: test?.numOfQuestions,
      };
      const response = await generateQues(data);
      const transformedQuestions = response?.data?.map((item, index) => ({
        id: index + 1,
        question: item,
      }));
      setQuestions(transformedQuestions);
    } catch (err) {
      alert(err.message || "question generation failed");
    }
  };
  useEffect(() => {
    handleGenerateQuestions();
  }, []);
  const columns = [
    {
      key: "id",
      label: "S.No",
    },
    {
      key: "question",
      label: "Question",
    },

    {
      key: "action",
      label: "Action",
      render: () => (
        <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
          Start
        </button>
      ),
    },
  ];

  return (
    <div className="py-12 px-4">
      <h2 className="text-2xl font-bold text-center mb-4">{test?.name}</h2>

      <TableComponent
        columns={columns}
        rows={questions}
        selectedKey={selectedKey}
        setSelectedKey={setSelectedKey}
      />
    </div>
  );
};

export default QuestionsList;
