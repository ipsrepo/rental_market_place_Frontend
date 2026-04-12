import axiosInstance from "./API/axiosInstance.js";
import {API_ENDPOINTS} from "../constants/endPoints.js";


const API = API_ENDPOINTS.USER;

export const createUser = (user) => axiosInstance.post(`${API}/signup`, user);

export const loginUser = (user) => axiosInstance.post(`${API}/login`, user);

export const getUser = (userId) => axiosInstance.get(`${API}/${userId}`);

export const deleteUser = (userId) => axiosInstance.delete(`${API}/${userId}`);