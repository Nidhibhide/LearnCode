import React, { useState, useEffect } from "react";
import { useDisclosure } from "@heroui/react";
import {
  SearchFilters,
  PaginationControls,
  NotFoundControls,
  TableComponent,
  ModalWrapper,
  SummaryCards,
  LevelBreakdown,
  TechStack,
  ActivityCalendar,
} from "../../components/index";
import { getMyStats, getMyLanguages, getMyActivity } from "../../api";
import { FaList } from "react-icons/fa";

const mockSolvedTests = [
  {
    _id: "1",
    questionName: "Two Sum",
    testName: "JavaScript Basics",
    language: "JavaScript",
    submissions: 3,
    isCorrect: true,
    submittedAt: "2026-03-15",
    level: "Basic",
  },
  {
    _id: "2",
    questionName: "Reverse Linked List",
    testName: "Data Structures",
    language: "Python",
    submissions: 1,
    isCorrect: true,
    submittedAt: "2026-03-14",
    level: "Intermediate",
  },
  {
    _id: "3",
    questionName: "Binary Search",
    testName: "Algorithms",
    language: "JavaScript",
    submissions: 2,
    isCorrect: true,
    submittedAt: "2026-03-13",
    level: "Basic",
  },
  {
    _id: "4",
    questionName: "Merge Sort",
    testName: "Advanced Algorithms",
    language: "Python",
    submissions: 5,
    isCorrect: false,
    submittedAt: "2026-03-12",
    level: "Advanced",
  },
  {
    _id: "5",
    questionName: "Dynamic Programming",
    testName: "DP Practice",
    language: "C++",
    submissions: 4,
    isCorrect: true,
    submittedAt: "2026-03-11",
    level: "Advanced",
  },
  {
    _id: "6",
    questionName: "Stack Implementation",
    testName: "Data Structures",
    language: "Java",
    submissions: 1,
    isCorrect: true,
    submittedAt: "2026-03-10",
    level: "Intermediate",
  },
  {
    _id: "7",
    questionName: "Queue Operations",
    testName: "Data Structures",
    language: "JavaScript",
    submissions: 2,
    isCorrect: true,
    submittedAt: "2026-03-09",
    level: "Basic",
  },
  {
    _id: "8",
    questionName: "Binary Tree Traversal",
    testName: "Tree Structures",
    language: "Python",
    submissions: 3,
    isCorrect: true,
    submittedAt: "2026-03-08",
    level: "Intermediate",
  },
  {
    _id: "9",
    questionName: "Graph Algorithms",
    testName: "Graph Theory",
    language: "C++",
    submissions: 2,
    isCorrect: true,
    submittedAt: "2026-03-07",
    level: "Advanced",
  },
  {
    _id: "10",
    questionName: "Hash Table",
    testName: "Data Structures",
    language: "JavaScript",
    submissions: 1,
    isCorrect: true,
    submittedAt: "2026-03-06",
    level: "Basic",
  },
  {
    _id: "11",
    questionName: "Sorting Algorithms",
    testName: "Algorithms",
    language: "Python",
    submissions: 4,
    isCorrect: false,
    submittedAt: "2026-03-05",
    level: "Intermediate",
  },
  {
    _id: "12",
    questionName: "String Manipulation",
    testName: "String Problems",
    language: "Java",
    submissions: 2,
    isCorrect: true,
    submittedAt: "2026-03-04",
    level: "Basic",
  },
];

// Column definitions for solved tests table
const solvedColumns = [
  { key: "questionName", label: "QUESTION NAME" },
  { key: "testName", label: "TEST NAME" },
  { key: "language", label: "LANGUAGE" },
  { key: "level", label: "LEVEL" },
  {
    key: "submissions",
    label: "SUBMISSIONS",
    render: (row) => <span className="font-medium">{row.submissions}</span>,
  },
  {
    key: "isCorrect",
    label: "STATUS",
    render: (row) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${row.isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
      >
        {row.isCorrect ? "Correct" : "Incorrect"}
      </span>
    ),
  },
  {
    key: "submittedAt",
    label: "SUBMITTED AT",
    render: (row) => new Date(row.submittedAt).toLocaleDateString("en-GB"),
  },
];

function MyScores() {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [solvedTests, setSolvedTests] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);

  // Filter states
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("All");
  const [languageFilter, setLanguageFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(1);

  // Modal state
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Calendar state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const selectedYear = selectedDate.getFullYear();
  const selectedMonth = selectedDate.getMonth();

  const handleMonthChange = (month, year) => {
    setSelectedDate(new Date(year, month, 1));
  };

  // Fetch activity data when month/year changes
  useEffect(() => {
    const fetchActivity = async () => {
      const response = await getMyActivity(selectedYear, selectedMonth);
      if (response.success && response.data) {
        setCalendarEvents(response.data);
      }
    };
    fetchActivity();
  }, [selectedYear, selectedMonth]);

  // Summary data from API
  const [summaryData, setSummaryData] = useState({
    totalSolved: 0,
    totalSubmissions: 0,
    acceptanceRate: 0,
    basic: 0,
    intermediate: 0,
    advanced: 0,
  });

  // Languages data from API
  const [languages, setLanguages] = useState([]);

  // Load data from API
  useEffect(() => {
    const fetchStats = async () => {
      const response = await getMyStats();
      if (response.status && response.data) {
        setSummaryData({
          totalSolved: response.data.totalSolved || 0,
          totalSubmissions: response.data.totalSolved || 0, // Using same as totalSolved until we have separate endpoint
          acceptanceRate:
            response.data.totalSolved > 0
              ? Math.round(
                  (response.data.totalSolved /
                    (response.data.totalSolved || 1)) *
                    100,
                )
              : 0,
          basic: response.data.basic || 0,
          intermediate: response.data.intermediate || 0,
          advanced: response.data.advanced || 0,
        });
      }
    };

    const fetchLanguages = async () => {
      const response = await getMyLanguages();
      if (response.status && response.data) {
        setLanguages(response.data);
      }
    };

    fetchStats();
    fetchLanguages();
    // Keep mock data for table display
    setSolvedTests(mockSolvedTests);
    setTotal(mockSolvedTests.length);
  }, [selectedYear, selectedMonth]);

  // Filter solved tests
  const filteredTests = solvedTests.filter((test) => {
    const matchesSearch =
      test.questionName.toLowerCase().includes(search.toLowerCase()) ||
      test.testName.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = level === "All" || test.level === level;
    const matchesLanguage =
      languageFilter === "All" || test.language === languageFilter;
    return matchesSearch && matchesLevel && matchesLanguage;
  });

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen overflow-x-hidden">
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-6">
        My Progress
      </h1>

      {/* SECTION 1: SUMMARY CARDS */}
      <section className="mb-4">
        <SummaryCards
          totalSolved={summaryData.totalSolved}
          totalSubmissions={summaryData.totalSubmissions}
          acceptanceRate={summaryData.acceptanceRate}
          onViewMoreClick={onOpen}
        />
      </section>

      {/* SECTIONS 2 & 3: SIDE BY SIDE - responsive split */}
      <div className="flex flex-col gap-4">
        {/* Scoreboard - full width */}
        <div className="w-full">
          {/* SECTION 2: SOLVED TESTS TABLE */}
          <section className="bg-white border border-gray-200 p-4 md:p-6 rounded-xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between ">
              <div className="flex items-center gap-2">
                <FaList className="text-blue-500 text-xl" />
                <h2 className="text-xl font-semibold text-gray-700">
                  Scoreboard
                </h2>
              </div>
            </div>

            {/* Filters */}
            {/* <div className="mb-4"> */}
            <SearchFilters
              search={search}
              setSearch={setSearch}
              setLevel={setLevel}
              setLanguageFilter={setLanguageFilter}
            />
            {/* </div> */}

            {/* Table */}
            {filteredTests.length > 0 ? (
              <>
                <div className="overflow-x-auto overflow-y-auto max-h-96">
                  <TableComponent
                    columns={solvedColumns}
                    rows={filteredTests}
                    selectedKey={selectedKey}
                    setSelectedKey={setSelectedKey}
                  />
                </div>
                <PaginationControls
                  page={page}
                  setPage={setPage}
                  hasNext={filteredTests.length > 10}
                  total={total}
                  limit={10}
                />
              </>
            ) : (
              <NotFoundControls
                title="No Tests Found"
                description="Try adjusting your filters."
              />
            )}
          </section>
        </div>

        {/* SECTION 3: LANGUAGES & ACTIVITY - side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Tech Stack */}
          <TechStack languages={languages} />

          {/* Activity Calendar */}
          <ActivityCalendar
            events={calendarEvents}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={handleMonthChange}
          />
        </div>
      </div>

      {/* Modal for Level Counts */}
      <ModalWrapper
        isOpen={isOpen}
        onOpenChange={(open) => !open && onClose()}
        title="Total Tests by Level"
        size="md"
        navigateOnClose={false}
      >
        <div className="py-4">
          <LevelBreakdown
            basic={summaryData.basic}
            intermediate={summaryData.intermediate}
            advanced={summaryData.advanced}
          />
        </div>
      </ModalWrapper>
    </div>
  );
}

export default MyScores;
