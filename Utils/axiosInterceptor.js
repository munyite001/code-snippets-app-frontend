import axios from "axios";
import { useGlobalContext } from "../src/context/GlobalProvider";

const useAxiosWithAuth = (url) => {
    const { logoutUser } = useGlobalContext();

    const axiosInstance = axios.create({
        baseURL: url,
    });

    // Add request interceptor to include token
    axiosInstance.interceptors.request.use(
        async (config) => {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Add response interceptor to handle token expiration
    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (error.response?.status === 401) {
                await logoutUser();
            }
            return Promise.reject(error);
        }
    );

    return axiosInstance;
};

export default useAxiosWithAuth;
