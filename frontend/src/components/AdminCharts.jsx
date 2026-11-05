import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { PaginationControls } from './Filters';
import TableComponent from './TableComponent';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

/**
 * BarChart component for displaying language attempt statistics
 */
export const LanguageBarChart = ({ data, width = 320, height = 250 }) => {
  return (
    <BarChart width={width} height={height} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="attempts" fill="#8884d8" />
    </BarChart>
  );
};

/**
 * PieChart component for displaying difficulty distribution
 */
export const DifficultyPieChart = ({ data, width = 320, height = 250 }) => {
  return (
    <PieChart width={width} height={height}>
      <Pie
        data={data}
        cx={130}
        cy={110}
        innerRadius={50}
        outerRadius={80}
        paddingAngle={2}
        dataKey="value"
        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
        labelLine={false}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend verticalAlign="middle" align="right" layout="vertical" />
    </PieChart>
  );
};

/**
 * LineChart component for displaying weekly activity
 */
export const WeeklyActivityChart = ({ data, width = 320, height = 250 }) => {
  return (
    <LineChart width={width} height={height} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="tests" stroke="#8884d8" strokeWidth={2} />
    </LineChart>
  );
};

/**
 * User stats card component
 */
export const StatCard = ({ title, value, colorClass }) => {
  return (
    <div className="bg-surface border border-border p-6 rounded-xl">
      <h2 className="text-lg font-medium text-textSecondary mb-1">{title}</h2>
      <p className={`text-3xl font-bold ${colorClass}`}>{value}</p>
    </div>
  );
};

/**
 * Leaderboard component with filter and table
 */
export const Leaderboard = ({ 
  leaderboardFilter, 
  setLeaderboardFilter, 
  data, 
  loading = false,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange = () => {}
}) => {
  const filterOptions = [
    { value: 'overall', label: 'All Time', color: 'bg-primary', hover: 'hover:bg-primaryHover' },
    { value: 'weekly', label: 'This Week', color: 'bg-success', hover: 'hover:bg-success' },
  ];

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  if (loading) {
    return (
      <div className="bg-surface border border-border p-6 rounded-xl mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-textPrimary">Leaderboard</h2>
          <div className="flex gap-2">
            {filterOptions.map((filter) => (
              <button
                key={filter.value}
                className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${filter.color} opacity-50 cursor-not-allowed`}
                disabled
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          <span className="ml-3 text-textSecondary">Loading leaderboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border p-6 rounded-xl mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-textPrimary">Leaderboard</h2>
        <div className="flex gap-2">
          {filterOptions.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setLeaderboardFilter(filter.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${filter.color} ${
                leaderboardFilter === filter.value ? 'ring-2 ring-offset-2 ring-borderDark' : ''
              } ${leaderboardFilter !== filter.value ? filter.hover : ''} opacity-90 hover:opacity-100`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-y-auto max-h-[400px]">
        <TableComponent
          columns={[
            { 
              key: 'rank', 
              label: 'RANK',
              render: (row) => {
                const rank = row.rank;
                const colorClass = rank === 1 ? 'bg-warningBg text-warning' : rank === 2 ? 'bg-borderDark text-textPrimary' : rank === 3 ? 'bg-warningBg text-warning' : 'bg-border text-textSecondary';
                return (
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${colorClass}`}>
                    {rank}
                  </span>
                );
              }
            },
            { key: 'name', label: 'NAME' },
            { 
              key: 'language', 
              label: 'LANGUAGE',
              render: (row) => row.language ? (
                <span className="px-2 py-1 bg-infoBg text-info rounded text-sm">{row.language}</span>
              ) : null
            },
            { 
              key: 'score', 
              label: 'SCORE',
              render: (row) => (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${leaderboardFilter === 'weekly' ? 'bg-successBg text-success' : 'bg-infoBg text-info'}`}>
                  {row.score || 0}
                </span>
              )
            },
          ]}
          rows={data.map((user, index) => ({
            ...user,
            rank: (currentPage - 1) * itemsPerPage + index + 1,
          }))}
        />
      </div>

      <div className="flex justify-center mt-2 pt-2">
        <PaginationControls
          page={currentPage}
          setPage={handlePageChange}
          hasNext={currentPage < totalPages}
          total={totalItems}
          limit={itemsPerPage}
        />
      </div>
    </div>
  );
};

export default {
  LanguageBarChart,
  DifficultyPieChart,
  WeeklyActivityChart,
  StatCard,
  Leaderboard,
};
