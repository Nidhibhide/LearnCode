// Utility functions for common operations
export { handleApiResponse, handleApiError } from './apiResponseHandler';

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const navigateTo = (navigate, path) => {
  navigate(path);
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
