// src/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // single source of truth
  // withCredentials: false, // keep false unless you use cookies
  timeout: 15000,
});

export default api;
