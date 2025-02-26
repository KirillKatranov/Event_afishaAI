import axiosInstance from "@/shared/api/AxiosConfig";

class UserService {
  async getUser(
    params: {}
  ) {
    console.log("Send GET available cities list with params: ", params);

    const response = await axiosInstance.get(
      '',
      {
        params: params
      });

    return response;
  };
}

export default new UserService();
