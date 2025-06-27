import axiosInstance from "@/shared/api/AxiosConfig";
import {AxiosError} from "axios";
import {ParticipantsResponse} from "@/features/participants";

class ParticipantsService {
  async getParticipants(params: { content_id: string }) {
    try {
      console.log("Send GET event participants list");

      const response: ParticipantsResponse = await axiosInstance.get(
        `/content/${params.content_id}/likes/social`
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

export default new ParticipantsService();
