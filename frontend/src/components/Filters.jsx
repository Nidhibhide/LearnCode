import { MdSort, MdFilterList } from "react-icons/md";
import { NotFound } from "../images/index";
export const SearchFilters = ({ setSearch, setLevel, setSortOrder }) => (
  <div className="  p-6 mb-4">
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* 🔍 Search Bar */}
      <input
        type="text"
        placeholder="Search here..."
        className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        name="search"
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Sort + Filter - Right Side */}
      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        {/* 🧠 Filter by Level */}
        <div className="relative w-full">
          <MdFilterList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <select
            className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            name="level"
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="">Select Level</option>
            <option value="All">Select All</option>
            <option value="Basic">Basic</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* 📅 Sort by */}
        <div className="relative w-full ">
          <MdSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <select
            className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            name="sortOrder"
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>
    </div>
  </div>
);

export const PaginationControls = ({ page, setPage, hasNext }) => (
  <div className="mt-8 flex justify-center items-center gap-2">
    <button
      className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition duration-150 ease-in-out "
      onClick={() => setPage(page - 1)}
      disabled={page <= 1}
    >
      Previous
    </button>

    <button
      className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition duration-150 ease-in-out"
      onClick={() => setPage(page + 1)}
      disabled={!hasNext}
    >
      Next
    </button>
  </div>
);

export const NotFoundControls = ({
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


