import axiosInstance from "@/shared/api/AxiosConfig";
import {AxiosError} from "axios";
import {OrganizationEventsResponse, UserEventsResponse} from "@/features/organizer-content";

class OrganizerEventsService {
  async getOrganizationEvents(params: { id: string }) {
    try {
      console.log("Send GET organization events");

      const response: OrganizationEventsResponse = await axiosInstance.get(
        `/organisations/${params.id}/contents`,
      );

      return { data: response.data };
    } catch (error) {
      if (error instanceof AxiosError) {
        return { error: error.message };
      }
      return { error: "Неизвестная ошибка" }
    }
  };

  async getUserEvents(params: { id: string }) {
    try {
      console.log("Send GET user events");

      const response: UserEventsResponse = await axiosInstance.get(
        `/users/${params.id}/contents`,
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

export default new OrganizerEventsService();
