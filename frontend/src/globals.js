import axios from 'axios';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:8080';

const baseURL = `${SERVER_URL}/api`;
const socketURL = SERVER_URL;

export const globalaxios = axios.create({
  baseURL,
  withCredentials: true,
});

// Show rate-limit errors once (avoids spam if many requests fail together)
let lastRateLimitToastAt = 0;
globalaxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 429) {
      const now = Date.now();
      if (now - lastRateLimitToastAt > 3000) {
        lastRateLimitToastAt = now;
        const message =
          error.response.data?.message ||
          'Too many requests. Please try again later.';
        toast.error(message);
      }
      // Mark so page-level handlers don't toast again
      error.__rateLimited = true;
    }
    return Promise.reject(error);
  }
);

export const socket = io(socketURL, {
  withCredentials: true,
});