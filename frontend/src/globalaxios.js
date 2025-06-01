import axios from "axios";

const globalaxios = axios.create({
  // baseURL: "http://localhost:8080/api",
  baseURL: "https://learncode-65ec.onrender.com/api",
  withCredentials: true,
});

export default globalaxios;
