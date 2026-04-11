import axiosInstance from "./API/axiosInstance.js";
import {API_ENDPOINTS} from "../constants/endPoints.js";

const API = API_ENDPOINTS.PROPERTY;


export const getAllProperties = () => axiosInstance.get(API);

export const addProperty = (formData) =>
    axiosInstance.post(API, formData, {
        headers: {'Content-Type': 'multipart/form-data'},
    });

export const getPropertyById = (id) =>
    axiosInstance.get(`${API}/${id}`)

export const updateProperty = (id, formData) =>
    axiosInstance.patch(`${API}/${id}`, formData, {
        headers: {'Content-Type': 'multipart/form-data'},
    });

export const deleteProperty = (id) => axiosInstance.delete(`${API}/${id}`);

export const getUserProperties = (ownerId) =>
    axiosInstance.get(`${API}/owner/${ownerId}`);