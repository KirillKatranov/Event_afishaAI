import axios from 'axios';

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

    return Promise.reject(error);
  }
);

export default axiosInstance;
