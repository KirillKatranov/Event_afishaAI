import {ContentParams, EventResponse, EventsResponse} from "@/features/content";
import {Event} from "@/entities/event";
import axiosInstance from "@/shared/api/AxiosConfig";

class ContentService {
  async getContent (
    params: ContentParams
  ) {
    console.log("Send GET events request with params: ", params);

    const response: EventsResponse = await axiosInstance.get<Event[]>(
      '/contents',
      {
        params: params
      });

    return response;
  };

  async getSingleEvent(
    id: string | number
  ) {
    console.log("Send GET single event request with id: ", id);

    const response: EventResponse = await axiosInstance.get<Event>(
      `/contents/${id}`
    );

    return response;
  }
}

export default new ContentService();
