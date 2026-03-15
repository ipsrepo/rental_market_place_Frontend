import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!BASE_URL) {
    throw new Error("VITE_API_BASE_URL is not defined");
}

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
});

axiosInstance.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error)
);

export default axiosInstance;
