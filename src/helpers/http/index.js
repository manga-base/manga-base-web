import axios from "axios";
import { getToken } from "../storage/token";

let instance = axios.create({
  baseURL: process.env["REACT_APP_BASE_URL"],
});

instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const http = instance;
