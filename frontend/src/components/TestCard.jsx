import { MdDelete } from "react-icons/md";
import { MdModeEditOutline } from "react-icons/md";
import { Tooltip } from "./index";
import { useNavigate } from "react-router-dom";

const TestCard = ({ test }) => {
  const role = JSON.parse(localStorage.getItem("data"))?.role;
  const navigate = useNavigate();
  const levelColor = {
    Basic: "border-green-400 bg-green-100",
    Intermediate: "border-yellow-400 bg-yellow-100",
    Advanced: "border-red-400 bg-red-100",
  };

  const levelText = {
    Basic: "text-green-700",
    Intermediate: "text-yellow-700",
    Advanced: "text-red-700",
  };

  const handleDelete = () => {
    navigate(`/dashboard/viewTest/deleteTest/${test?._id}`, {
      state: { name: test?.name },
    });
  };
  const handleEdit = () => {
    navigate(`/dashboard/viewTest/editTest/${test?._id}`, {
      state: { test: test },
    });
  };
  const handleClick = () => {
    if (role === "admin") {
      navigate("/dashboard/viewTest", {
        state: { preview: true, questions: test.questions },
      });
    } else {
      navigate("/dashboard/assessments", {
        state: { preview: true, questions: test.questions },
      });
    }
  };
  const handleStart = () => {
    navigate("/dashboard/questionsList", {
      state: { test: test },
    });
  };

  return (
    <div
      className={`max-w-sm w-full mx-auto ${
        levelColor[test.level]
      } shadow-md rounded-2xl p-5 hover:shadow-xl transition duration-300 h-[200px] w-[300px] relative`}
    >
      <h2 className="text-lg font-bold mb-2 ">{test.name}</h2>

      {role === "admin" && (
        <div className="flex absolute top-4 right-4 gap-2">
          <Tooltip icon={MdDelete} label="Delete" onClick={handleDelete} />

          <Tooltip icon={MdModeEditOutline} label="Edit" onClick={handleEdit} />
        </div>
      )}

      <p className="text-base text-gray-600">
        <strong>Language:</strong> {test.language}
      </p>
      <p className={`text-base ${levelText[test.level]} `}>
        <strong>Level:</strong> {test.level}
      </p>
      <p onClick={handleClick} className="text-base text-gray-600">
        <strong>Questions:</strong>
        <span className="text-blue-600 hover:underline hover:font-medium cursor-pointer">
          {" "}
          Preview
        </span>
      </p>
      {role === "user" && (
        <div className="mt-4 text-center">
          <button
            onClick={handleStart}
            className=" py-2 w-full text-base bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Start
          </button>
        </div>
      )}
    </div>
  );
};

export default TestCard;
