import axiosInstance from "./API/axiosInstance.js";
import {API_ENDPOINTS} from "../constants/endPoints.js";

const API = API_ENDPOINTS.FAVORITE;


export const addFavorite = (data) => axiosInstance.post(API, data);

export const deleteFavorite = (data) => axiosInstance.delete(API, {data});

export const getUserFavorites = (userId) => axiosInstance.get(`${API}?user=${userId}`);