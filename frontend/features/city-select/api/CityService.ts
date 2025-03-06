import axiosInstance from "@/shared/api/AxiosConfig";
import {CitiesResponse, SaveCityRequest} from "@/features/city-select";
import {AxiosError} from "axios";

class CityService {
  async getCities() {
    try {
      console.log("Send GET available cities list");

      const response: CitiesResponse = await axiosInstance.get(
        '/cities'
      );

      return { data: response.data };
    } catch (error) {
      if (error instanceof AxiosError) {
        return { error: error.message };
      }
    }
  };

  async saveCity(params: SaveCityRequest) {
    try {
      console.log("Send PATCH city request");

      await axiosInstance.patch(
        '/users',
        params,
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        return { error: error.message };
      }
    }
  };
}

export default new CityService();
