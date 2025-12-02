import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const AdminDashboard = () => {
  // Static data for demonstration
  const userStats = {
    totalUsers: 1250,
    activeUsers: 890,
    testCompletionRate: 75.5,
  };

  const languageData = [
    { name: 'JavaScript', attempts: 450 },
    { name: 'Python', attempts: 380 },
    { name: 'Java', attempts: 320 },
    { name: 'C++', attempts: 280 },
    { name: 'C', attempts: 200 },
  ];

  const leaderboardData = [
    { name: 'Alice Johnson', score: 950, language: 'JavaScript' },
    { name: 'Bob Smith', score: 920, language: 'Python' },
    { name: 'Charlie Brown', score: 890, language: 'Java' },
    { name: 'Diana Prince', score: 870, language: 'C++' },
    { name: 'Eve Wilson', score: 850, language: 'JavaScript' },
  ];

  const weeklyLeaderboard = [
    { name: 'Alice Johnson', score: 450 },
    { name: 'Bob Smith', score: 420 },
    { name: 'Charlie Brown', score: 390 },
  ];

  const monthlyLeaderboard = [
    { name: 'Diana Prince', score: 1200 },
    { name: 'Eve Wilson', score: 1150 },
    { name: 'Alice Johnson', score: 1100 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="p-6 bg-gray-50 h-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard — Analytics</h1>

      {/* User Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Users</h2>
          <p className="text-3xl font-bold text-blue-600">{userStats.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Active Users</h2>
          <p className="text-3xl font-bold text-green-600">{userStats.activeUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Test Completion Rate</h2>
          <p className="text-3xl font-bold text-purple-600">{userStats.testCompletionRate}%</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Most Attempted Languages */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Most Attempted Languages</h2>
          <BarChart width={400} height={300} data={languageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="attempts" fill="#8884d8" />
          </BarChart>
        </div>

        {/* Language Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Language Distribution</h2>
          <PieChart width={400} height={300}>
            <Pie
              data={languageData}
              cx={200}
              cy={150}
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="attempts"
            >
              {languageData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>

      {/* Leaderboards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Leaderboard */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Overall Leaderboard</h2>
          <div className="space-y-3">
            {leaderboardData.map((user, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.language}</p>
                </div>
                <p className="font-bold text-blue-600">{user.score}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Leaderboard */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Weekly Leaderboard</h2>
          <div className="space-y-3">
            {weeklyLeaderboard.map((user, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <p className="font-medium">{user.name}</p>
                <p className="font-bold text-green-600">{user.score}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Leaderboard */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Monthly Leaderboard</h2>
          <div className="space-y-3">
            {monthlyLeaderboard.map((user, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <p className="font-medium">{user.name}</p>
                <p className="font-bold text-purple-600">{user.score}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;