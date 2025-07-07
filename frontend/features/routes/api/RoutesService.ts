import axiosInstance from "@/shared/api/AxiosConfig";
import {AxiosError} from "axios";
import {RoutesResponse} from "@/features/routes";

class RoutesService {
  async getRoutes() {
    try {
      console.log("Send GET all routes list");

      const response: RoutesResponse = await axiosInstance.get(
        '/routes'
      );

      return { data: response.data };
    } catch (error) {
      if (error instanceof AxiosError) {
        return { error: error.message };
      }
      return { error: "Неизвестная ошибка" }
    }
  };
}

export default new RoutesService();
