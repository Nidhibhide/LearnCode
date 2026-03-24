import { MdSort, MdFilterList } from "react-icons/md";
import { NotFound } from "../images/index";
import { Button } from "./index";
import { TEST_LEVELS, SUPPORTED_LANGUAGES } from "../constants";
export const SearchFilters = ({ search, setSearch, setLevel, setLanguageFilter }) => (
  <div className="md:p-6 p-4 md:mb-4">
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
      {/* 🔍 Search Bar */}
      <input
        type="text"
        placeholder="Search here..."
        className="w-full lg:w-1/2 px-4 py-2 border border-borderDark rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-sm md:text-base"
        name="search"
        value={search || ''}
        onChange={(e) => setSearch?.(e.target.value)}
      />

      {/* Filters - Right Side */}
      <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
        {/* 🧠 Filter by Level */}
        {setLevel && (
          <div className="relative w-full">
            <MdFilterList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary" />
            <select
              className="w-full pl-7 pr-3 py-2 border border-borderDark rounded-lg bg-surface focus:ring-2 focus:ring-primary focus:outline-none text-sm md:text-base"
              name="level"
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="">Select Level</option>
              <option value="All">Select All</option>
              {TEST_LEVELS.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        )}

        {/* Language Filter */}
        {setLanguageFilter && (
          <div className="relative w-full">
            <select
              className="w-full px-3 py-2 border border-borderDark rounded-lg bg-surface focus:ring-2 focus:ring-primary focus:outline-none text-sm md:text-base"
              name="language"
              onChange={(e) => setLanguageFilter(e.target.value)}
            >
              <option value="All">All Languages</option>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        )}

        
      </div>
    </div>
  </div>
);

export const PaginationControls = ({ page, setPage, hasNext, total, limit }) => {
  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="md:mt-8 mt-3 flex justify-center items-center gap-2">
      <Button
        className="px-3 md:px-4 py-2 font-medium text-sm md:text-base bg-surfaceAlt text-textPrimary rounded hover:bg-border transition duration-150 ease-in-out"
        onClick={() => setPage(page - 1)}
        disabled={page <= 1}
      >
        Previous
      </Button>

      <span className="text-sm md:text-base text-textSecondary">
        Page {page} of {totalPages}
      </span>

      <Button
        className="px-3 md:px-4 py-2 font-medium text-sm md:text-base bg-surfaceAlt text-textPrimary rounded hover:bg-border transition duration-150 ease-in-out"
        onClick={() => setPage(page + 1)}
        disabled={!hasNext || page >= totalPages}
      >
        Next
      </Button>
    </div>
  );
};

export const NotFoundControls = ({
  title = "No Data Found",
  description = "Try adjusting your search, filters, or check back later.",
}) => {
  return (
    <div className="flex flex-col items-center justify-center mt-20 text-center px-4">
      <img
        src={NotFound}
        alt="No data"
        className="md:w-64 md:h-64 w-52 h-44 object-contain mb-6"
      />
      <h2 className="md:text-2xl text-xl  font-semibold text-textPrimary">{title}</h2>
      <p className="text-textSecondary mt-2">{description}</p>
    </div>
  );
};
