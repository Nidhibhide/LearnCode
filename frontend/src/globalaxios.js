import axios from "axios";

const globalaxios= axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
});

export default globalaxios;
