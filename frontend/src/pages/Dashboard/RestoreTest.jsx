import React, { useState, useEffect } from "react";
import { GetDeletedAll, restore } from "../../api/test";
import {
  SearchFilters,
  PaginationControls,
  NotFoundControls,
  TableComponent,
  Button,
} from "../../components/index";

import { toast } from "react-toastify";
import { FaArrowsRotate } from "react-icons/fa6";
import { handleApiResponse, handleApiError } from "../../utils";

function RestoreTest() {
  // Column definitions
  const columns = [
    { 
      key: "name", 
      label: "TEST NAME",
      render: (row) => (
        <span className="font-medium text-base">{row.name}</span>
      )
    },
    { 
      key: "numOfQuestions", 
      label: "NO. OF QUESTIONS",
      render: (row) => (
        <span className="font-medium text-base">{row.numOfQuestions}</span>
      )
    },
    { 
      key: "language", 
      label: "LANGUAGE",
      render: (row) => row.language ? (
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">{row.language}</span>
      ) : null
    },
    { 
      key: "level", 
      label: "LEVEL",
      render: (row) => {
        const levelColors = {
          Basic: 'bg-green-100 text-green-700',
          Intermediate: 'bg-yellow-100 text-yellow-700',
          Advanced: 'bg-red-100 text-red-700',
        };
        return row.level ? (
          <span className={`px-2 py-1 rounded text-sm ${levelColors[row.level] || 'bg-gray-100 text-gray-700'}`}>
            {row.level}
          </span>
        ) : null;
      }
    },
    {
      key: "restore",
      label: "RESTORE",
      render: (row) => (
        <Button
          onClick={() => handleRestore(row)}
          className="text-blue-600 hover:text-blue-800"
        >
          <FaArrowsRotate size={14} />
        </Button>
      ),
    },
  ];
  const [tests, setTests] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);

  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("All");
  const [languageFilter, setLanguageFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(1);

  const filters = {
    search,
    sortOrder,
    page,
    limit: 5,
    level,
    languageFilter,
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
      const { status } = handleApiResponse(res);

      if (status === 200) {
        setTimeout(() => navigate("/dashboard/restoreTest"), 3000);
      }
    } catch (err) {
      handleApiError(err, "test restore failed");
    }
  };

  useEffect(() => {
    handleViewTests();
  }, [level, sortOrder, search, page]);

  return (
    <div className="md:py-12 py-4 px-4 w-full">
      <h1 className="md:text-2xl text-xl font-bold text-center">Restore Test</h1>

      {/* Search, Filter, Sort UI */}
      <SearchFilters
        search={search}
        setSearch={setSearch}
        setLevel={setLevel}
        setLanguageFilter={setLanguageFilter}
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
          total={total}
          limit={5}
        />
      ) : (
        <NotFoundControls />
      )}
    </div>
  );
}

export default RestoreTest;
