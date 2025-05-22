import React, { useState, useEffect } from "react";
// import { GetDeletedAll, restore } from "../../../../../api/test";
import {
  SearchFilters,
  PaginationControls,
  NotFoundControls,
} from "../../../../components/index";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  user,
} from "@heroui/react";
import { toast } from "react-toastify";
import { getAllAttempts } from "../../../../api/attempts";

// Column definitions
const columns = [
  { key: "name", label: "TEST NAME" },
  { key: " score", label: "SCORE" },
  { key: "language", label: "LANGUAGE" },
  { key: "level", label: "LEVEL" },
  { key: "completedAt", label: "COMPLETED AT" },
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
      const response = await getAllAttempts(filters, user);
      setTotal(response?.data?.total || 0);
      setTests(response?.data?.data || []);
    } catch (err) {
      alert(err.message || "View attempted tests failed");
    }
  };

  useEffect(() => {
    handleViewTests();
  }, [level, sortOrder, search, page]);

  return (
    <div className="py-12 px-5">
      <h1 className="text-2xl font-bold text-center mb-4">My Scores</h1>

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
                <TableCell>{test.language}</TableCell>
                <TableCell>{test.level}</TableCell>
                <TableCell>{test.score}</TableCell>
                <TableCell>
                  {new Date(test.completedAt).toLocaleDateString("en-GB")}
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

export default MyScores;
