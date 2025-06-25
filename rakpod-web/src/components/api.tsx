import axios from "axios";

const API = axios.create({
  baseURL: "http://203.150.118.11:2542",
});

export default API;