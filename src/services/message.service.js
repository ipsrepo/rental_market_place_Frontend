import axiosInstance from "./API/axiosInstance";

const MESSAGE_URL = "/messages";

export const sendMessage = async (messageData) => {
    try {
        const response = await axiosInstance.post(`${MESSAGE_URL}/send`, messageData);
        return response.data;
    } catch (error) {
        return {
            status: "error",
            message: error.response?.data?.message || error.message
        };
    }
};

export const getUserMessages = async (userId) => {
    try {
        const response = await axiosInstance.get(`${MESSAGE_URL}/user/${userId}`);
        return response.data;
    } catch (error) {
        return {
            status: "error",
            message: error.response?.data?.message || error.message
        };
    }
};