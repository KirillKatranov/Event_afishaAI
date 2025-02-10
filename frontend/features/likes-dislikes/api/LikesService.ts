import {ReactionsParams, LikesResponse} from "@/features/likes-dislikes/model/types/likes.types";
import axiosInstance from "@/shared/api/AxiosConfig";
import {Event} from "@/entities/event";
import {ActionData, ActionResponse, ActionResponseData} from "@/features/likes-dislikes/model/types/useraction.types";

class LikesService {
  async getReactions(
    params: ReactionsParams
  ) {
    console.log("Send GET reaction request with params: ", params);

    const response: LikesResponse = await axiosInstance.get<Event[]>(
      '/contents/liked',
      {
        params: params
      });
    return response;
  }

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

export default new LikesService();
