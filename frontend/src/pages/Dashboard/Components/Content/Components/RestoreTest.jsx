import React, { useState, useEffect } from "react";
import { GetDeletedAll, restore } from "../../../../../api/test";
import {
  SearchFilters,
  PaginationControls,
  NotFoundControls,
} from "../../../../../components/index";

import { toast } from "react-toastify";
import { FaArrowsRotate } from "react-icons/fa6";
import { TableComponent } from "../../../../../components/index";

function RestoreTest() {
  // Column definitions
  const columns = [
    { key: "name", label: "TEST NAME" },
    { key: "numOfQuestions", label: "NO. OF QUESTIONS" },
    { key: "language", label: "LANGUAGE" },
    { key: "level", label: "LEVEL" },

    {
      key: "restore",
      label: "RESTORE",
      render: (row) => (
        <button
          onClick={() => handleRestore(row)}
          className="text-blue-600 hover:text-blue-800"
        >
          <FaArrowsRotate size={14} />
        </button>
      ),
    },
  ];
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
      const response = await GetDeletedAll(filters);
      setTotal(response?.total || 0);
      setTests(response?.data || []);
    } catch (err) {
      alert(err.message || "View deleted tests failed");
    }
  };

  const handleRestore = async (test) => {
    try {
      const res = await restore(test?._id);

      const { message, statusCode } = res;
      if (statusCode === 200 && message) {
        toast.success(message);
        setTimeout(() => navigate("/dashboard/restoreTest"), 3000);
      } else if (message) {
        toast.error(message);
      }
    } catch (err) {
      toast.error(err.message || "test restore failed");
    }
  };

  useEffect(() => {
    handleViewTests();
  }, [level, sortOrder, search, page]);

  return (
    <div className="py-12 px-5 md:w-full w-screen">
      <h1 className="text-2xl font-bold text-center mb-4">Restore Test</h1>

      {/* Search, Filter, Sort UI */}
      <SearchFilters
        search={search}
        setSearch={setSearch}
        level={level}
        setLevel={setLevel}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      {/* Table */}

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

export default RestoreTest;
