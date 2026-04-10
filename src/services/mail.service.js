import axiosInstance from "./API/axiosInstance.js";
import {API_ENDPOINTS} from "../constants/endPoints.js";

const API = API_ENDPOINTS.MAIL;


export const sendMail = (id, data) => axiosInstance.post(`${API}/${id}`, data);
