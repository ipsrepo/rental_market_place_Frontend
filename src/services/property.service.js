import axiosInstance from "./API/axiosInstance.js";
import {API_ENDPOINTS} from "../constants/endPoints.js";


export const getAllProperties = () => axiosInstance.get(API_ENDPOINTS.PROPERTY);

export const addProperty = (data) => axiosInstance.post(API_ENDPOINTS.PROPERTY, data);