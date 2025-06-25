import axios from "axios";

const API = axios.create({
  baseURL: "http://203.150.118.11:2541",
});

export default API;