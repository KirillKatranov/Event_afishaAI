import axiosInstance from "@/shared/api/AxiosConfig";
import {UserRequest, UserResponse} from "@/entities/user";

class UserService {
  async getUser(
    params: UserRequest
  ) {
    console.log("Send GET user request");

    const response: UserResponse = await axiosInstance.get(
      '/users',
      {
        params: params
      });

    return response;
  };
}

export default new UserService();
