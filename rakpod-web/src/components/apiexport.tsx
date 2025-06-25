import axios from "axios";

const APIEP = axios.create({
  baseURL: "http://localhost:2542",
});

export default APIEP;