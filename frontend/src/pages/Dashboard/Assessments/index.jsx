import {
  SearchFilters,
  PaginationControls,
  NotFoundControls,
  TestCard,
} from "../../../components/index";
import { getAll, getAllOngoing } from "../../../api/test";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Tabs, Tab } from "@heroui/react";
import { Preview } from "../ViewTest/index";
import { toast } from "react-toastify";
import { getUserId } from "../../../utils";
const Assessments = () => {
  const [tests, setTests] = useState([]);

  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedTab, setSelectedTab] = useState("new");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(1);
  const user = getUserId();
  const location = useLocation();
  const preview = location.state?.preview;
  //api
  const filtersNew = {
    search,
    sortOrder,
    page,
    limit: 5,
    level,
    onlyUnattempted: true,
    userId: user,
  };
  const filtersOnGoing = {
    search,
    sortOrder,
    page,
    limit: 5,
    level,
    onlyOnGoing: true,
  };

  const handleViewTests = async () => {
    try {
      const response =
        selectedTab === "new"
          ? await getAll(filtersNew)
          : await getAllOngoing(filtersOnGoing, user);

      setTotal(response?.total);
      setTests(response?.data);
    } catch (err) {
      toast.error(err.message || "View Unattempted Tests failed");
    }
  };
  useEffect(() => {
    handleViewTests();
  }, [level, sortOrder, search, page, selectedTab, user]);

  return (
    <div className="py-4 sm:py-8 md:py-12 px-4 min-h-screen">
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-4">
        Assessments
      </h1>

      <div className="flex w-full flex-col">
        <Tabs
          aria-label="Options"
          classNames={{
            tabList: "flex w-full",
            tab: "w-1/2 text-center",
          }}
          onSelectionChange={(key) => {
            setSelectedTab(key);
            setPage(1);
          }}
        >
          <Tab key="new" title="New Tests">
            <SearchFilters
              search={search}
              setSearch={setSearch}
              level={level}
              setLevel={setLevel}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
            <div className="grid grid-cols-1  md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 pb-4 overflow-y-auto max-h-[60vh] md:max-h-[70vh]">
              {tests.map((test, index) => (
                <TestCard key={index} test={test} />
              ))}
            </div>
          </Tab>

          <Tab key="ongoing" title="Ongoing">
            <SearchFilters
              search={search}
              setSearch={setSearch}
              level={level}
              setLevel={setLevel}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 pb-4 overflow-y-auto max-h-[60vh] md:max-h-[70vh]">
              {tests.map((test, index) => (
                <TestCard key={index} test={test} />
              ))}
            </div>
          </Tab>
        </Tabs>
      </div>
      {/* Search, Filter, Sort UI */}

      {/* pagination */}
      {total !== 0 && (
        <PaginationControls
          page={page}
          setPage={setPage}
          hasNext={tests.length === 5}
          total={total}
          limit={5}
        />
      )}

      {/* Not Found */}
      {total === 0 && <NotFoundControls />}
      {/* <Outlet /> */}
      {preview && <Preview />}
    </div>
  );
};
export default Assessments;
