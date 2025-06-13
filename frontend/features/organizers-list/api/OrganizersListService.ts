import axiosInstance from "@/shared/api/AxiosConfig";
import {AxiosError} from "axios";
import {OrganizersListResponse} from "@/features/organizers-list";

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

      const response: OrganizersListResponse = await axiosInstance.get(
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

  async deleteUserOrganizers(params: { id: number, username: string }) {
    try {
      console.log("Send DELETE user organizer");

      await axiosInstance.delete(
        `/organisations/${params.id}?username=${params.username}`
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        return { error: error.message };
      }
      return { error: "Неизвестная ошибка" }
    }
  }
}

export default new OrganizersListService();
