import { MdDelete } from "react-icons/md";
import { MdModeEditOutline } from "react-icons/md";
import { Tooltip } from "./index";
import { useNavigate } from "react-router-dom";

const TestCard = ({ test }) => {
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
    navigate(`/dashboard/viewTest/deleteTest/${test?._id}`,{
      state:{name:test?.name}
    });
  };
  const handleEdit = () => {
    navigate(`/dashboard/viewTest/editTest/${test?._id}`,{
      state:{test:test}
    });
  };

  return (
    <div
      className={`max-w-sm w-full mx-auto ${
        levelColor[test.level]
      } shadow-md rounded-2xl p-5 hover:shadow-xl transition duration-300 h-[200px] w-[300px] relative`}
    >
      <h2 className="text-lg font-bold mb-2 ">{test.name}</h2>
      <div className="flex absolute top-4 right-4 gap-2">
        {/* Delete Icon with Tooltip */}

        <Tooltip icon={MdDelete} label="Delete" onClick={handleDelete} />
        {/* Edit Icon with Tooltip */}
        <Tooltip icon={MdModeEditOutline} label="Edit" onClick={handleEdit} />
      </div>

      <p className="text-base text-gray-600">
        <strong>Language:</strong> {test.language}
      </p>
      <p className={`text-base ${levelText[test.level]} `}>
        <strong>Level:</strong> {test.level}
      </p>
      <p className="text-base text-gray-600">
        <strong>Questions:</strong> {test.numOfQuestions}
      </p>
      <p className="text-base text-gray-500 mt-2">
        <strong>Created: </strong>
        {new Date(test.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default TestCard;
