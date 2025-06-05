import axiosInstance from "@/shared/api/AxiosConfig";
import {AxiosError} from "axios";
import {OrganizersListResponse, UserOrganizersListResponse} from "@/features/organizers-list";

class OrganizersListService {
  async getOrganizers() {
    try {
      console.log("Send GET organizers list");

      const response: OrganizersListResponse = await axiosInstance.get(
        '/organisations'
      );

      return { data: response.data };
    } catch (error) {
      if (error instanceof AxiosError) {
        return { error: error.message };
      }
      return { error: "Неизвестная ошибка" }
    }
  };

  async getUserOrganizers(params: { username: string }) {
    try {
      console.log("Send GET user organizers list");

      const response: UserOrganizersListResponse = await axiosInstance.get(
        `/users/${params.username}/organisations`
      );

      return { data: response.data };
    } catch (error) {
      if (error instanceof AxiosError) {
        return { error: error.message };
      }
      return { error: "Неизвестная ошибка" }
    }
  }
}

export default new OrganizersListService();
