import axiosInstance from "@/shared/api/AxiosConfig";

class CityService {
  async getCities(
    params: {}
  ) {
    console.log("Send GET available cities list with params: ", params);

    const response = await axiosInstance.get(
      '/contents',
      {
        params: params
      });

    return response;
  };
}

export default new CityService();
