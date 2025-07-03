import { TestCard } from "../../../../../../components/index";
import {
  SearchFilters,
  PaginationControls,
  NotFoundControls,
} from "../../../../../../components/index";
import { getAll } from "../../../../../../api/test";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Preview } from "./Components/index";

const index = () => {
  const [tests, setTests] = useState([]);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(1);
  const location = useLocation();
  const preview = location.state?.preview;

  //api
  const filters = {
    search,
    sortOrder,
    page,
    limit: 5,
    level,
  };

  const handleViewTests = async () => {
    try {
      const response = await getAll(filters);
      setTotal(response?.total);

      setTests(response?.data);
    } catch (err) {
      alert(err.message || "View Tests failed");
    }
  };

  useEffect(() => {
    handleViewTests();
  }, [level, sortOrder, search, page]);

  return (
    <div className="md:py-12 py-4 px-4  h-full">
      <h1 className="md:text-2xl text-xl font-bold text-center md:mb-4">
        View Tests
      </h1>

      {/* Search, Filter, Sort UI */}
      <SearchFilters
        search={search}
        setSearch={setSearch}
        level={level}
        setLevel={setLevel}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      {/* Cards */}
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto max-h-[55vh]">
  {tests.map((test, index) => (
    <TestCard key={index} test={test} />
  ))}
</div>


      {/* pagination */}
      {total !== 0 && (
        <PaginationControls
          page={page}
          setPage={setPage}
          hasNext={tests.length === 5}
        />
      )}

      {/* Not Found */}
      {total === 0 && <NotFoundControls />}
      <Outlet />
      {preview && <Preview />}
    </div>
  );
};
export default index;
