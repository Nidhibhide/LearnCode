// Utility functions for common operations
export { handleApiResponse, handleApiError } from './apiResponseHandler';

export const getUserData = () => {
  try {
    return JSON.parse(localStorage.getItem("data"));
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    return null;
  }
};

export const setUserData = (data) => {
  try {
    localStorage.setItem("data", JSON.stringify(data));
  } catch (error) {
    console.error("Error setting user data to localStorage:", error);
  }
};

export const getUserId = () => {
  const data = getUserData();
  return data?._id;
};

export const getUserRole = () => {
  const data = getUserData();
  return data?.role;
};

export const getUserEmail = () => {
  const data = getUserData();
  return data?.email;
};

export const getUserName = () => {
  const data = getUserData();
  return data?.name;
};

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
