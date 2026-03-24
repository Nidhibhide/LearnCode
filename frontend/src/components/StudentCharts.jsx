import React from 'react';
import { FaCheckCircle, FaClock, FaTrophy, FaLanguage, FaCalendarAlt, FaCode, FaStar, FaCheck, FaTimes } from 'react-icons/fa';
import { SUPPORTED_LANGUAGES, DAYS, MONTHS, YEARS } from '../constants';
import TableComponent from './TableComponent';

/**
 * Summary cards component for MyScores page
 * Displays total tests, submissions, and acceptance rate with colored backgrounds
 */
export const SummaryCards = ({ 
  totalSolved = 0, 
  totalSubmissions = 0, 
  acceptanceRate = 0,
  onViewMoreClick = null
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
      {/* Total Tests Card */}
      <div className="bg-primary rounded-xl p-5 md:p-6 text-white">
        <div className="flex items-center justify-between mb-3">
          <FaCheckCircle className="text-2xl md:text-3xl" />
          <span className="text-3xl md:text-4xl font-bold">
            {totalSolved}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <h3 className="text-base md:text-lg font-medium opacity-90">
            Total Tests
          </h3>
          {onViewMoreClick && (
            <button
              onClick={onViewMoreClick}
              className="text-sm font-medium opacity-80 hover:opacity-100 underline cursor-pointer"
            >
              View More
            </button>
          )}
        </div>
      </div>

      {/* Total Submissions Card */}
      <div className="bg-secondary rounded-xl p-5 md:p-6 text-white">
        <div className="flex items-center justify-between mb-3">
          <FaClock className="text-2xl md:text-3xl" />
          <span className="text-3xl md:text-4xl font-bold">
            {totalSubmissions}
          </span>
        </div>
        <h3 className="text-base md:text-lg font-medium opacity-90">
          Total Submissions
        </h3>
      </div>

      {/* Acceptance Rate Card */}
      <div className="bg-success rounded-xl p-5 md:p-6 text-white">
        <div className="flex items-center justify-between mb-3">
          <FaTrophy className="text-2xl md:text-3xl" />
          <span className="text-3xl md:text-4xl font-bold">
            {acceptanceRate}%
          </span>
        </div>
        <h3 className="text-base md:text-lg font-medium opacity-90">
          Acceptance Rate
        </h3>
      </div>
    </div>
  );
};

/**
 * Get color class based on language name
 */
const getLanguageColor = (name) => {
  const isSupported = SUPPORTED_LANGUAGES.includes(name);
  if (!isSupported) return "bg-surfaceAlt";
   
  switch (name) {
    case "JavaScript": return "bg-warningBg";
    case "Python": return "bg-infoBg";
    case "Java": return "bg-warningBg";
    case "C++": return "bg-secondaryBg";
    case "C": return "bg-surfaceAlt";
    default: return "bg-surfaceAlt";
  }
};

/**
 * Tech Stack component for displaying user's solved languages
 */
export const TechStack = ({ languages = [] }) => {
  return (
    <section className="bg-surface border border-border p-4 md:p-6 rounded-xl flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <FaLanguage className="text-primary text-xl" />
        <h2 className="text-xl font-semibold text-textPrimary">
          Tech Stack
        </h2>
      </div>

      <div>
        <table className="w-full">
          <thead className="bg-surfaceAlt sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-base font-bold text-textPrimary">
                Language
              </th>
              <th className="px-4 py-3 text-right text-base font-bold text-textPrimary">
                Solved
              </th>
            </tr>
          </thead>
          <tbody>
            {languages.length > 0 ? (
              languages.map((lang, index) => (
                <tr
                  key={index}
                  className="border-b border-border hover:bg-surfaceAlt"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 ${getLanguageColor(lang.name)} rounded-lg flex items-center justify-center text-lg flex-shrink-0`}
                      >
                        {lang.icon}
                      </div>
                      <span className="text-base font-medium text-textPrimary">
                        {lang.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-infoBg text-info">
                      {lang.solvedCount}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="px-4 py-8 text-center text-textSecondary">
                  No languages found. Start solving tests to see your tech stack!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

/**
 * Level breakdown component for modal display
 */
export const LevelBreakdown = ({ basic = 0, intermediate = 0, advanced = 0 }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-successBg rounded-lg">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 bg-success rounded-full"></span>
          <span className="text-lg font-medium text-textPrimary">Basic</span>
        </div>
        <span className="text-2xl font-bold text-success">
          {basic}
        </span>
      </div>
      <div className="flex items-center justify-between p-4 bg-warningBg rounded-lg">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 bg-warning rounded-full"></span>
          <span className="text-lg font-medium text-textPrimary">
            Intermediate
          </span>
        </div>
        <span className="text-2xl font-bold text-warning">
          {intermediate}
        </span>
      </div>
      <div className="flex items-center justify-between p-4 bg-errorBg rounded-lg">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 bg-error rounded-full"></span>
          <span className="text-lg font-medium text-textPrimary">
            Advanced
          </span>
        </div>
        <span className="text-2xl font-bold text-error">
          {advanced}
        </span>
      </div>
    </div>
  );
};

/**
 * Activity Calendar component for displaying user's daily activity
 */
/**
 * Get difficulty badge class based on level
 */
const getDifficultyBadge = (difficulty) => {
  const level = difficulty?.toLowerCase();
  switch (level) {
    case 'basic':
      return { bg: 'bg-successBg', text: 'text-success', border: 'border-success' };
    case 'intermediate':
      return { bg: 'bg-warningBg', text: 'text-warning', border: 'border-warning' };
    case 'advanced':
      return { bg: 'bg-errorBg', text: 'text-error', border: 'border-error' };
    default:
      return { bg: 'bg-surfaceAlt', text: 'text-textPrimary', border: 'border-border' };
  }
};

/**
 * Solved Tests Table component for displaying user's solved tests
 * Uses TableComponent from @heroui/react
 * Maps API fields: questionName, testName, language, level, isCorrect, submittedAt
 */
export const SolvedTestsTable = ({ 
  tests = [], 
  onTestClick = null,
  showLanguage = true,
  showDate = true,
  showDifficulty = true,
  showScore = true,
  emptyMessage = "No solved tests yet. Start solving tests to see your progress!"
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  };

  // Build columns based on visibility props
  const columns = [
    { key: "questionName", label: "QUESTION NAME", width: "min-w-[250px]" },
    { key: "testName", label: "TEST NAME", width: "min-w-[180px]" },
    ...(showLanguage ? [{ key: "language", label: "LANGUAGE", width: "min-w-[120px]" }] : []),
    ...(showDifficulty ? [{
      key: "level",
      label: "LEVEL",
      width: "min-w-[100px]",
      render: (row) => {
        const diff = getDifficultyBadge(row.level);
        return (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${diff.bg} ${diff.text} ${diff.border}`}>
            {row.level || 'Basic'}
          </span>
        );
      }
    }] : []),
    {
      key: "status",
      label: "STATUS",
      width: "min-w-[120px]",
      render: (row) => {
        const status = row.status || "not_attempted";
        const statusConfig = {
          correct: { bg: "bg-successBg", text: "text-success", label: "Correct" },
          wrong: { bg: "bg-errorBg", text: "text-error", label: "Wrong" },
          not_attempted: { bg: "bg-surfaceAlt", text: "text-textPrimary", label: "Not Attempted" },
        };
        const config = statusConfig[status] || statusConfig.not_attempted;
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
            {config.label}
          </span>
        );
      },
    },
    ...(showDate ? [{
      key: "submittedAt",
      label: "SUBMITTED AT",
      width: "min-w-[130px]",
      render: (row) => formatDate(row.submittedAt)
    }] : []),
  ];

  return (
    <div className="overflow-x-auto">
      {tests.length > 0 ? (
        <TableComponent
          columns={columns}
          rows={tests}
          onSelectionChange={(keys) => {
            if (onTestClick && keys.size > 0) {
              const key = Array.from(keys)[0];
              const selectedTest = tests.find(t => t._id === key);
              if (selectedTest) onTestClick(selectedTest);
            }
          }}
        />
      ) : (
        <div className="flex items-center justify-center h-full text-textSecondary py-8">
          {emptyMessage}
        </div>
      )}
    </div>
  );
};

/**
 * Activity Calendar component for displaying user's daily activity
 */
export const ActivityCalendar = ({ 
  events = [], 
  selectedMonth = new Date().getMonth(),
  selectedYear = new Date().getFullYear(),
  onMonthChange = null
}) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();
  
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();

  const getEventCount = (day) => {
    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const event = events.find(e => e.date === dateStr);
    return event ? event.count : 0;
  };

  return (
    <section className="bg-surface border border-border p-4 md:p-6 rounded-xl flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-success text-xl" />
          <h2 className="text-xl font-semibold text-textPrimary">Activity</h2>
        </div>
        {onMonthChange && (
          <div className="flex items-center gap-2">
            <select value={selectedMonth} onChange={(e) => onMonthChange(parseInt(e.target.value), selectedYear)} className="text-sm border border-borderDark bg-sidebar text-white rounded px-2 py-1">
              {MONTHS.map((month, index) => <option key={index} value={index}>{month}</option>)}
            </select>
            <select value={selectedYear} onChange={(e) => onMonthChange(selectedMonth, parseInt(e.target.value))} className="text-sm border border-borderDark bg-sidebar text-white rounded px-2 py-1">
              {YEARS.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>
        )}
      </div>
      <div className="bg-surfaceAlt p-3 rounded-lg">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map(day => <div key={day} className="text-center text-xs text-textSecondary font-medium">{day}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => <div key={i} className="h-10 bg-border" />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1, count = getEventCount(day), today = selectedYear === currentYear && selectedMonth === currentMonth && day === currentDay;
            return <div key={day} className={`h-10 rounded flex items-center justify-center text-sm font-bold relative ${count ? 'bg-success text-white' : 'bg-border text-textPrimary'} ${today ? 'ring-4 ring-primary' : ''}`} title={count ? `${count} submissions` : ''}>{day}{count > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full border-2 border-surface" />}</div>;
          })}
        </div>
        <div className="flex items-center justify-center gap-6 mt-3 text-sm font-bold text-textPrimary">
          <div className="flex items-center gap-2"><div className="w-5 h-5 rounded bg-border border border-borderDark" /><span>No activity</span></div>
          <div className="flex items-center gap-2"><div className="w-5 h-5 rounded bg-success border border-success" /><span>Activity</span></div>
        </div>
      </div>
    </section>
  );
};

export default {
  SummaryCards,
  LevelBreakdown,
  TechStack,
  ActivityCalendar,
  SolvedTestsTable,
};
