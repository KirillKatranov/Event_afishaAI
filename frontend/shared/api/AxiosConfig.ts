import axios from 'axios';
import {router} from "expo-router";
import {NEW_USER} from "@/shared/constants";

const axiosInstance = axios.create({
  baseURL: 'https://afishabot.ru/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 700,
});

const MAX_RETRIES = 5;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    if (error.code === "ECONNABORTED") {
      if (!config.__retryCount) config.__retryCount = 0;

      if (config.__retryCount < MAX_RETRIES) {
        config.__retryCount += 1;

        await new Promise((resolve) => setTimeout(resolve, 1000));

        return axiosInstance(config);
      }
    }

    if (error.response?.status === 404) {
      const errorData = error.response.data;

      if (errorData?.detail === "User not found") {
        console.log("New user")
        router.push({pathname: '/onboarding', params: { user: NEW_USER }});
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
