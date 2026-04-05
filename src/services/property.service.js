import axiosInstance from "./API/axiosInstance.js";
import {API_ENDPOINTS} from "../constants/endPoints.js";


export const getAllProperties = () => axiosInstance.get(API_ENDPOINTS.PROPERTY);

export const addProperty = (formData) =>
    axiosInstance.post(API_ENDPOINTS.PROPERTY, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

export const updateProperty = (id, formData) =>
    axiosInstance.patch(`${API_ENDPOINTS.PROPERTY}/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });