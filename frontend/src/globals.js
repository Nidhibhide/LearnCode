import axios from "axios";
import { SERVER } from "../config";
import { io } from "socket.io-client";

export const globalaxios = axios.create({
  baseURL: `${SERVER}/api`,
  withCredentials: true,
});

export const socket = io(SERVER, {
  transports: ["websocket"],
  withCredentials: true,
});
