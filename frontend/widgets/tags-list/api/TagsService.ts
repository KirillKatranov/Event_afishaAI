import {PreferencesRequest, PreferencesResponse, TagsData, TagsRequest, TagsResponse} from "@/widgets/tags-list";
import axiosInstance from "@/shared/api/AxiosConfig";

class TagsService {
  async getTags(params: TagsRequest) {
    console.log("Send GET tags request with params: ", params);

    const response: TagsResponse = await axiosInstance.get<TagsData>(
      "/tags",
      {
        params: params
      }
    );

    return response;
  }

  async savePreference(params: PreferencesRequest) {
    console.log("Send POST preference response: ", params);

    const response: PreferencesResponse = await axiosInstance.post<string>(
      "/preferences/categories",
      {},
      {
        params: params
      }
    );

    return response;
  }

  async deletePreference(params: PreferencesRequest) {
    console.log("Send DELETE preference response: ", params);

    const response: PreferencesResponse = await axiosInstance.delete<string>(
      "/preferences/categories",
      {
        params: params
      }
    );

    return response;
  }
}

export default new TagsService();
