import { MdSort, MdFilterList } from "react-icons/md";
const SearchFilters = ({ setSearch, setLevel, setSortOrder }) => (
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

export default SearchFilters;
