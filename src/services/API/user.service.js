import axiosInstance from "./axiosInstance.js";
import {API_ENDPOINTS} from "../../constants/endPoints.js";


export const createUser = (user) => axiosInstance.post(`${API_ENDPOINTS.USER}/signup`, user);

export const loginUser = (user) => axiosInstance.post(`${API_ENDPOINTS.USER}/login`, user);