import React, { useState, useEffect } from "react";
import { GetDeletedAll, restore } from "../../../../../api/test";
import {
  SearchFilters,
  PaginationControls,
  NotFoundControls,
} from "../../../../../components/index";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { toast } from "react-toastify";
import { FaArrowsRotate } from "react-icons/fa6";

// Column definitions
const columns = [
  { key: "name", label: "TEST NAME" },
  { key: "numOfQuestions", label: "NO. OF QUESTIONS" },
  { key: "language", label: "LANGUAGE" },
  { key: "level", label: "LEVEL" },
  { key: "restore", label: "RESTORE" },
];

function RestoreTest() {
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
  const statusMessages = {
    200: "Test Restored! Refresh the page to see the latest changes",
    400: "Invalid test ID",
    404: "Test not found",
    500: "Unexpected error occurred while restore test",
  };
  const handleViewTests = async () => {
    try {
      const response = await GetDeletedAll(filters);
      setTotal(response?.data?.total || 0);
      setTests(response?.data?.data || []);
    } catch (err) {
      alert(err.message || "View deleted tests failed");
    }
  };

  const handleRestore = async (test) => {
    try {
      const res = await restore(test?._id);

      const message = statusMessages[res?.status];
      if (res?.status === 200 && message) {
        toast.success(message);
        setTimeout(() => navigate("/dashboard/restoreTest"), 3000);
      } else if (message) {
        toast.error(message);
      }
    } catch (err) {
      alert(err.message || "test restore failed");
    }
  };

  useEffect(() => {
    handleViewTests();
  }, [level, sortOrder, search, page]);

  return (
    <div className="py-12 px-5">
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
      <div className="mt-6">
        <Table
          aria-label="Table showing deleted tests with restore option"
          selectionMode="single"
          selectedKeys={selectedKey ? [selectedKey] : []}
          onSelectionChange={(keys) => {
            const keyArray = Array.from(keys);
            setSelectedKey(keyArray[0]);
          }}
        >
          <TableHeader>
            {columns.map((col) => (
              <TableColumn
                key={col.key}
                className="text-sm font-bold text-black"
              >
                {col.label}
              </TableColumn>
            ))}
          </TableHeader>

          <TableBody>
            {tests.map((test) => (
              <TableRow key={test._id}>
                <TableCell>{test.name}</TableCell>
                <TableCell>{test.numOfQuestions}</TableCell>
                <TableCell>{test.language}</TableCell>
                <TableCell>{test.level}</TableCell>
                <TableCell>
                  <button
                    onClick={() => handleRestore(test)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaArrowsRotate size={14} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
