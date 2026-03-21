import { globalaxios } from "../globals";

// Get user stats for admin dashboard
export const getUserStats = async () => {
  try {
    const res = await globalaxios.get("/dashboard/user-stats");
    return res.data;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};

// Get most attempted languages for admin dashboard
export const getLanguageStats = async () => {
  try {
    const res = await globalaxios.get("/dashboard/language-stats");
    return res.data;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};

// Get difficulty/level distribution for admin dashboard
export const getDifficultyStats = async () => {
  try {
    const res = await globalaxios.get("/dashboard/levels-stats");
    return res.data;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};

// Get weekly activity for admin dashboard
export const getWeeklyActivity = async () => {
  try {
    const res = await globalaxios.get("/dashboard/weekly-activity");
    return res.data;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};

// Get leaderboard with time-based filters
// @param filter - 'overall' | 'weekly' | 'monthly' | 'yearly'
// @param limit - number of results to return (default 10)
// @param page - page number for pagination (default 1)
export const getLeaderboard = async (filter = 'overall', limit = 10, page = 1) => {
  try {
    const res = await globalaxios.get("/dashboard/leaderboard", {
      params: { filter, limit, page },
    });
    return res.data;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};

// Get current user's test stats for MyScores page
export const getMyStats = async () => {
  try {
    const res = await globalaxios.get("/dashboard/my-stats");
    return res.data;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};

// Get current user's languages with solved counts for Tech Stack section
export const getMyLanguages = async () => {
  try {
    const res = await globalaxios.get("/dashboard/my-languages");
    return res.data;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};

// Get current user's activity for Activity Calendar section
// @param year - optional year (defaults to current year)
// @param month - optional month (0-11, defaults to current month)
export const getMyActivity = async (year, month) => {
  try {
    const res = await globalaxios.get(`/dashboard/my-activity?year=${year}&month=${month}`);
    return res.data;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};
