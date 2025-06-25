import axios from "axios";

const APIEP = axios.create({
  baseURL: "http://203.150.118.11:2542",
});

export default APIEP;