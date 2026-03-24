import React, { useState, useEffect } from "react";
import { useDisclosure } from "@heroui/react";
import {
  SearchFilters,
  PaginationControls,
  ModalWrapper,
  SummaryCards,
  LevelBreakdown,
  TechStack,
  ActivityCalendar,
  SolvedTestsTable,
} from "../../components/index";
import {
  getMyStats,
  getMyLanguages,
  getMyActivity,
  getMySolvedTests,
} from "../../api";
import { FaList } from "react-icons/fa";

// Mock data removed - now using API

// Column definitions for solved tests table


function MyScores() {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [solvedTests, setSolvedTests] = useState([]);

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
  const [loading, setLoading] = useState(false);

  // Fetch solved tests from API
  const fetchSolvedTests = async () => {
    setLoading(true);
    const response = await getMySolvedTests(
      search,
      level,
      languageFilter,
      page,
      10,
    );
    if (response.success && response.data) {
      setSolvedTests(response.data);
      setTotal(response.total || 0);
    }
    setLoading(false);
  };

  // Load data from API
  useEffect(() => {
    const fetchStats = async () => {
      const response = await getMyStats();
      if (response.success && response.data) {
        setSummaryData({
          totalSolved: response.data.totalSolved || 0,
          totalSubmissions: response.data.totalSubmissions || 0,
          acceptanceRate: response.data.acceptanceRate || 0,
          basic: response.data.basic || 0,
          intermediate: response.data.intermediate || 0,
          advanced: response.data.advanced || 0,
        });
      }
    };

    const fetchLanguages = async () => {
      const response = await getMyLanguages();
      if (response.success && response.data) {
        setLanguages(response.data);
      }
    };

    fetchStats();
    fetchLanguages();
  }, [selectedYear, selectedMonth]);

  // Fetch solved tests when filters or page change
  useEffect(() => {
    fetchSolvedTests();
  }, [search, level, languageFilter, page]);

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
            {loading ? (
              <div className="flex justify-center py-8">
                <span className="text-gray-500">Loading...</span>
              </div>
            ) : (
              <>
                <SolvedTestsTable
                  tests={solvedTests}
                  showLanguage={true}
                  showDate={true}
                  showDifficulty={true}
                  showScore={false}
                  emptyMessage="No solved tests yet. Start solving tests to see your progress!"
                />
                {solvedTests.length > 0 && (
                  <PaginationControls
                    page={page}
                    setPage={setPage}
                    hasNext={solvedTests.length === 10}
                    total={total}
                    limit={10}
                  />
                )}
              </>
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
