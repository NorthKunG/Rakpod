import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:2542/",
});

export default API;