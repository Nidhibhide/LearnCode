import React, { useState, useEffect } from "react";

import {
  SearchFilters,
  PaginationControls,
  NotFoundControls,
} from "../../../../../components/index";
import { TableComponent } from "../../../../../components/index";

import { getAllOngoing } from "../../../../../api/test";
import { toast } from "react-toastify";

// Column definitions
const columns = [
  { key: "name", label: "TEST NAME" },
  { key: "score", label: "SCORE" },
  { key: "language", label: "LANGUAGE" },
  { key: "level", label: "LEVEL" },

  {
    key: "completedAt",
    label: "COMPLETED AT",
    render: (row) => new Date(row.completedAt).toLocaleDateString("en-GB"),
  },
];

function MyScores() {
  const [tests, setTests] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);

  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(1);
  const user = JSON.parse(localStorage.getItem("data"))?._id;
  const filters = {
    search,
    sortOrder,
    page,
    limit: 5,
    level,
  };

  const handleViewTests = async () => {
    try {
      const response = await getAllOngoing(filters, user);
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
    <div className="md:py-12 py-4 px-4 w-screen md:w-full">
      <h1 className="md:text-2xl text-xl font-bold text-center">My Scores</h1>

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

export default MyScores;
