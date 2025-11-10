import axios from "axios";

const ApiUrl = process.env.NEXT_PUBLIC_API_URL;

const BaseService = axios.create({
  baseURL: ApiUrl,
  headers: {
    "Content-Type": "application/json",
    timeout: 60000, // Optional: timeout for requests
  },
});

BaseService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default BaseService;
