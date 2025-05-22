import { NotFound } from "../images/index";

const NotFoundControls = ({
  title = "No Data Found",
  description = "Try adjusting your search, filters, or check back later.",
}) => {
  return (
    <div className="flex flex-col items-center justify-center mt-20 text-center px-4">
      <img
        src={NotFound}
        alt="No data"
        className="w-64 h-64 object-contain mb-6"
      />
      <h2 className="text-2xl font-semibold text-gray-700">{title}</h2>
      <p className="text-gray-500 mt-2">{description}</p>
    </div>
  );
};

export default NotFoundControls;
