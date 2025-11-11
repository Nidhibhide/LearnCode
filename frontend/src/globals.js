import axios from 'axios';
import { io } from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:8080';

const baseURL = `${SERVER_URL}/api`;
const socketURL = SERVER_URL;

export const globalaxios = axios.create({
  baseURL,
  withCredentials: true,
});

export const socket = io(socketURL, {
  withCredentials: true,
});