import {ContentParams, EventsResponse, Event} from "@/widgets/Events";
import {ActionData, ActionResponseData, ActionResponse} from "@/widgets/Events";
import axiosInstance from "@/shared/api/AxiosConfig";

export class EventsService {
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

  async postAction (
    actionData: ActionData
  ) {
    console.log("Send POST like/dislike request");

    const response: ActionResponse = await axiosInstance.post<ActionResponseData>(
      `/${actionData.action}`,
      {
        username: actionData.username,
        content_id: actionData.contentId
      });

    return response;
  }
}
