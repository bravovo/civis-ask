import axios from "axios";

import { SERVER_URL } from "../config/env";
import { setTokenFromAxios } from "../state/profileSlice";

const api = axios.create({
  baseURL: SERVER_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const setupAxios = (store) => {
  api.interceptors.response.use(
    (response) => {
      const newToken = response.headers["x-new-access-token"];

      if (newToken) {
        console.log("TOKEN UPDATE");
        localStorage.setItem("token", newToken);

        store.dispatch(setTokenFromAxios({ token: newToken }));
      }
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        if (!window.location.pathname.includes("/login")) {
          console.warn("Перенаправлення на логін");
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
  );
};

export default api;
