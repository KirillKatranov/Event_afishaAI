import axiosInstance from "@/shared/api/AxiosConfig";
import {AxiosError} from "axios";
import {AvailableTagsResponse, CreateEventRequest} from "@/widgets/create-event-form";

class CreateEventService {
  async createEvent(params: { username: string, data: CreateEventRequest }) {
    try {
      console.log("Send POST create event request");

      await axiosInstance.post(
        `/contents?username=${params.username}`,
        params.data,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        return { error: error.message };
      }
      return { error: "Неизвестная ошибка" }
    }
  };

  async getAvailableTags(params: { username: string }) {
    try {
      console.log("Send GET available events tags list");

      const response: AvailableTagsResponse = await axiosInstance.get(
        `/tags?username=${params.username}&macro_category=events`
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

export default new CreateEventService();
