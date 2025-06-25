import axios from "axios";

const APIEP = axios.create({
  baseURL: "http://203.150.118.11:2541",
});

export default APIEP;