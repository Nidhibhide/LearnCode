import { MdDelete } from "react-icons/md";
import { MdModeEditOutline } from "react-icons/md";
import { Tooltip, Button } from "./index";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const TestCard = ({ test }) => {
  const role = useSelector((state) => state.user?.role);
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
      state: {
        isAttempted: test?.completedAt === null ? true : false,
        test: test,
      },
    });
  };

  return (
    <div
      className={`w-full mx-auto ${
        levelColor[test.level]
      } shadow-md rounded-2xl p-3 sm:p-4 hover:shadow-xl transition duration-300 min-h-[160px] sm:min-h-[180px] md:min-h-[200px] relative`}
    >
      <h2 className="text-sm sm:text-base font-bold mb-2 truncate leading-tight">{test.name}</h2>

      {role === "admin" && (
        <div className="flex absolute top-4 right-4 gap-2">
          <Tooltip icon={MdDelete} label="Delete" onClick={handleDelete} />

          <Tooltip icon={MdModeEditOutline} label="Edit" onClick={handleEdit} />
        </div>
      )}

      <p className="text-xs sm:text-sm text-gray-600">
        <strong>Language:</strong> {test.language}
      </p>
      <p className={`text-xs sm:text-sm ${levelText[test.level]} `}>
        <strong>Level:</strong> {test.level}
      </p>
      <p onClick={handleClick} className="text-xs sm:text-sm text-gray-600">
        <strong>Questions:</strong>
        <span className="text-blue-600 hover:underline hover:font-medium cursor-pointer">
          {" "}
          Preview
        </span>
      </p>
      {role === "student" && (
        <div className="mt-4 text-center">
          <Button
            width="w-full"
            onClick={handleStart}
          >
            {test?.completedAt === null ? "Resume" : "Start"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default TestCard;
