import axiosInstance from "@/shared/api/AxiosConfig";
import {FeedbackData, FeedbackResponse} from "@/pages/info";

class FeedbackService {
  async sendFeedback (
    feedbackData: FeedbackData,
  ) {
    console.log("Send POST feedback request with data: ", feedbackData);

    const response: FeedbackResponse = await axiosInstance.post<{ status: string }>(
      '/feedback',
      feedbackData
    );

    return response
  };
}

export default new FeedbackService();
