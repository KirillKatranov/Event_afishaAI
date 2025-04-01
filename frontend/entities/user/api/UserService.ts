import axiosInstance from "@/shared/api/AxiosConfig";
import {UserRegisterRequest, UserRegisterResponse, UserRequest, UserResponse} from "@/entities/user";

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

  async registerUser(
    params: UserRegisterRequest
  ) {
    console.log("Send POST register user request", params);

    const response: UserRegisterResponse = await axiosInstance.post(
      '/register/',
      params
    );

    return response;
  };
}

export default new UserService();
