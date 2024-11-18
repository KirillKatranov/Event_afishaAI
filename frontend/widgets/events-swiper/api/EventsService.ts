import {ContentParams, EventsResponse} from "@/widgets/events-swiper";
import {Event} from "@/entities/event";
import axiosInstance from "@/shared/api/AxiosConfig";

class EventsService {
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
}

export default new EventsService();
