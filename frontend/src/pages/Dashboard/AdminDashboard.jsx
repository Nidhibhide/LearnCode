import React, { useState, useEffect } from "react";
import {
  LanguageBarChart,
  DifficultyPieChart,
  WeeklyActivityChart,
  StatCard,
  Leaderboard,
} from "../../components";
import {
  getUserStats,
  getLanguageStats,
  getDifficultyStats,
  getWeeklyActivity,
  getLeaderboard,
} from "../../api";

const AdminDashboard = () => {
  const [leaderboardFilter, setLeaderboardFilter] = useState("overall");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    todayActive: 0,
    testsCompleted: 0,
    passRate: 0,
    completionRate: 0,
  });
  const [languageData, setLanguageData] = useState([]);
  const [difficultyData, setDifficultyData] = useState([]);
  const [weeklyActivityData, setWeeklyActivityData] = useState([]);

  // Fetch user stats from API
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await getUserStats();
        if (response.success) {
          setUserStats(response.data);
        }
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };

    const fetchLanguageStats = async () => {
      try {
        const response = await getLanguageStats();
        if (response.success) {
          setLanguageData(response.data);
        }
      } catch (error) {
        console.error("Error fetching language stats:", error);
      }
    };

    const fetchDifficultyStats = async () => {
      try {
        const response = await getDifficultyStats();
        if (response.success) {
          setDifficultyData(response.data);
        }
      } catch (error) {
        console.error("Error fetching difficulty stats:", error);
      }
    };

    const fetchWeeklyActivity = async () => {
      try {
        const response = await getWeeklyActivity();
        if (response.success) {
          setWeeklyActivityData(response.data);
        }
      } catch (error) {
        console.error("Error fetching weekly activity:", error);
      }
    };

    fetchUserStats();
    fetchLanguageStats();
    fetchDifficultyStats();
    fetchWeeklyActivity();
  }, []);

  // Handle filter change - reset page and fetch
  const handleFilterChange = (filter) => {
    setLeaderboardFilter(filter);
    setCurrentPage(1);
  };

  // Fetch leaderboard data when filter or page changes
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoadingLeaderboard(true);
      try {
        const response = await getLeaderboard(leaderboardFilter, itemsPerPage, currentPage);
        if (response.success) {
          setLeaderboardData(response.data);
          setTotalItems(response.total || 0);
          setTotalPages(Math.ceil((response.total || 0) / itemsPerPage) || 1);
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoadingLeaderboard(false);
      }
    };

    fetchLeaderboard();
  }, [leaderboardFilter, currentPage]);

  // Get the current leaderboard data based on filter and pagination
  const getCurrentLeaderboard = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return leaderboardData.slice(startIndex, endIndex);
  };



  return (
    <div className="p-4 md:p-6 bg-gray-100 h-screen overflow-y-auto overflow-x-hidden">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 ml-10 xl:ml-0">
        Admin Dashboard — Analytics
      </h1>

      {/* User Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={userStats.totalUsers}
          colorClass="text-blue-600"
        />
        <StatCard
          title="Today's Active"
          value={userStats.todayActive}
          colorClass="text-green-600"
        />
        <StatCard
          title="Pass Rate"
          value={`${userStats.passRate}%`}
          colorClass="text-purple-600"
        />
        <StatCard
          title="Completion Rate"
          value={`${userStats.completionRate}%`}
          colorClass="text-orange-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Most Attempted Languages */}
        <div className="bg-white border border-gray-200 p-6 rounded-xl flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-1 w-full">
            Most Attempted Languages
          </h2>
          <p className="text-sm text-gray-500 mb-4 w-full">
            Programming languages preferred by students
          </p>
          <LanguageBarChart data={languageData} />
        </div>

        {/* Difficulty Distribution Pie Chart */}
        <div className="bg-white border border-gray-200 p-6 rounded-xl flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-1 w-full">
            Tests by Difficulty
          </h2>
          <p className="text-sm text-gray-500 mb-4 w-full">
            Distribution of test difficulty levels
          </p>
          <DifficultyPieChart data={difficultyData} />
        </div>

        {/* Weekly Activity Line Chart */}
        <div className="bg-white border border-gray-200 p-6 rounded-xl flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-1 w-full">
            Weekly Activity
          </h2>
          <p className="text-sm text-gray-500 mb-4 w-full">
            Test attempts per day this week
          </p>
          <WeeklyActivityChart data={weeklyActivityData} />
        </div>
      </div>

      {/* Leaderboard Section - Show when data is available */}
      <Leaderboard
        leaderboardFilter={leaderboardFilter}
        setLeaderboardFilter={handleFilterChange}
        data={getCurrentLeaderboard()}
        loading={loadingLeaderboard}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default AdminDashboard;
