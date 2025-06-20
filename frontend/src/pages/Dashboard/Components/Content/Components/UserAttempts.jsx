import React, { useState, useEffect } from "react";

import {
  SearchFilters,
  PaginationControls,
  NotFoundControls,
} from "../../../../../components/index";
import { TableComponent } from "../../../../../components/index";

import { getAttemptAll } from "../../../../../api/testAttempt";
import { toast } from "react-toastify";

// Column definitions
const columns = [
  { key: "test", label: "TEST" },
  // { key: "score", label: "SCORE" },
  { key: "language", label: "LANGUAGE" },
  // { key: "level", label: "LEVEL" },
  { key: "name", label: "USER'S NAME" },
  { key: "email", label: "EMAIL" },

  {
    key: "completedAt",
    label: "STATUS",
    render: (row) => (row.completedAt === null ? "In Progress" : "Completed"),
  },
];

function UserAttempts() {
  const [tests, setTests] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);

  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(1);

  const filters = {
    search,
    sortOrder,
    page,
    limit: 5,
    level,
  };

  const handleViewTests = async () => {
    try {
      const response = await getAttemptAll(filters);
      setTotal(response?.total || 0);
      setTests(response?.data || []);
    } catch (err) {
    toast.error(err.message || "View attempted tests failed");
    }
  };

  useEffect(() => {
    handleViewTests();
  }, [level, sortOrder, search, page]);

  return (
    <div className="py-12 px-5">
      <h1 className="text-2xl font-bold text-center mb-4">User Attempts</h1>

      {/* Search, Filter, Sort UI */}
      <SearchFilters
        search={search}
        setSearch={setSearch}
        level={level}
        setLevel={setLevel}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      <TableComponent
        columns={columns}
        rows={tests}
        selectedKey={selectedKey}
        setSelectedKey={setSelectedKey}
      />

      {/* Pagination / Not Found */}
      {total !== 0 ? (
        <PaginationControls
          page={page}
          setPage={setPage}
          hasNext={tests.length === 5}
        />
      ) : (
        <NotFoundControls />
      )}
    </div>
  );
}

export default UserAttempts;
