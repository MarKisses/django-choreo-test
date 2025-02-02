import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

const apiUrl = "/choreo-apis/djangoreacttutorial/backend/v1"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },

    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        // If the error is 401 and there is no original._retry, then we try to refresh the token
        // It means that the token has expired and we need to refresh it
        if (
            error.response.status === 401 &&
            !originalRequest._retry &&
            refreshToken
        ) {
            originalRequest._retry = true;

            try {
                const response = await api.post("/api/v1/token/refresh/", {
                    refresh: refreshToken,
                });

                console.log("Token refreshed successfully:", response.data);

                const { access, refresh } = response.data;

                localStorage.setItem(ACCESS_TOKEN, access);
                localStorage.setItem(REFRESH_TOKEN, refresh);

                // Retry the original request
                originalRequest.headers.Authorization = `Bearer ${access}`;
                return axios.request(originalRequest);
            } catch (err) {
                console.error("Failed to refresh token:", err);
                localStorage.clear(); // если рефреш не сработал, разлогиниваем
                window.location.href = "/login";
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
