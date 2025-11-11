// API endpoints and configuration constants

export const API_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:8080';

// Judge0 API configuration
export const JUDGE_API_KEY = import.meta.env.VITE_JUDGE_API_KEY;
export const JUDGE_HOST = import.meta.env.VITE_JUDGE_HOST;
export const JUDGE_BASE_URL = 'https://judge0-ce.p.rapidapi.com';

// Google OAuth
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Supported languages mapping
export const LANGUAGE_IDS = {
  'C++': '54',
  'C': '50',
  'Java': '91',
  'Python': '100',
  'JavaScript': '97'
};

// Editor language mapping
export const EDITOR_LANGUAGES = {
  'C++': 'cpp',
  'C': 'cpp',
  'Java': 'java',
  'Python': 'python',
  'JavaScript': 'javascript'
};

// Test levels
export const TEST_LEVELS = ['Basic', 'Intermediate', 'Advanced'];

// Supported programming languages
export const SUPPORTED_LANGUAGES = ['Java', 'C++', 'JavaScript', 'Python', 'C'];

// Default comment templates
export const COMMENT_TEMPLATES = {
  'Python': '# Write your code here',
  'JavaScript': '// Write your code here',
  'Java': '// Write your code here',
  'C': '// Write your code here',
  'C++': '// Write your code here'
};

export const ROUTES = {
  DASHBOARD: "/dashboard",
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/verify-email",
  PROFILE: "/profile",
  SETTINGS: "/settings",
};
