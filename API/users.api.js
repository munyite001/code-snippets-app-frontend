import axios from "axios";

export const loginUser = async (loginData) => {
    try {
        const response = await axios.post(`/api/auth/login`, loginData);
        return response;
    } catch (error) {
        console.error("Error: ", error.response.data.message);
        throw error.response.data.message;
    }
};

export const registerUser = async (registrationData) => {
    try {
        const response = await axios.post(
            `/api/auth/register`,
            registrationData
        );
        return response;
    } catch (error) {
        console.error("Error: ", error.response.data.message);
        throw error.response.data.message;
    }
};

export const getUserData = async (id) => {
    try {
        const response = await axios.post(`/api/users/${id}`);
        return response;
    } catch (error) {
        console.error("Error: ", error.response.data.message);
        throw error.response?.data?.message;
    }
};
