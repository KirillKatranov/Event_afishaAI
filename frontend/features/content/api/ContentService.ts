import {ContentParams, EventResponse, EventsResponse, SearchResponse, SuggestionsResponse} from "@/features/content";
import {Event} from "@/entities/event";
import axiosInstance from "@/shared/api/AxiosConfig";
import {SearchParams} from "@/features/content";
import {AxiosError} from "axios";

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

  async getFeed (
    params: ContentParams
  ) {
    console.log("Send GET feed request with params: ", params);

    const response: EventsResponse = await axiosInstance.get<Event[]>(
      '/contents_feed',
      {
        params: params
      });

    return response;
  };

  async searchEvents(params: SearchParams) {
    try {
      console.log("Send GET search request with params: ", params);

      const response: SearchResponse = await axiosInstance.get(
        '/search',
        {
          params: params
        });

      return { data: response };
    } catch (e) {
      if (e instanceof AxiosError) {
        return { error: e.response?.data?.message };
      }
      return { error: "Неизвестная ошибка" }
    }
  }

  async searchSuggestions(params: { q: string, username: string }) {
    try {
      console.log("Send GET search suggestions with params: ", params);

      const response: SuggestionsResponse = await axiosInstance.get(
        '/search/suggestions',
        {
          params: params,
        });

      return { data: response.data };
    } catch (e) {
      if (e instanceof AxiosError) {
        return { error: e.response?.data?.message };
      }
      return { error: "Неизвестная ошибка" }
    }
  }

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
