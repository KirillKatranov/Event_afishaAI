import { create } from 'zustand';
import {feedbackService} from "@/pages/info";

interface FeedbackState {
  text: string;
  hasError: boolean;
  isSuccess: boolean;
  setText: (text: string) => void;
  submitFeedback: (username: string) => void;
}

export const useFeedbackStore = create<FeedbackState>((set) => ({
  text: '',
  hasError: false,
  isSuccess: false,

  setText: (text: string) => set({ text }),

  submitFeedback: (
    username: string
  ) => {
    set({ hasError: false, isSuccess: false });

    feedbackService.sendFeedback({ username: username, message: useFeedbackStore.getState().text })
      .then((response) => {
        if (response.status === 200) {
          console.log(`Successfully submit feedback`);
          set({ isSuccess: true });
        } else {
          console.log(`Feedback request error with code: ${response.status}`);
          set({ hasError: true });
        }
      })
      .catch((e) => {
        console.log(`Feedback request error: ${e}`);
        set({ hasError: true });
      })
  },
}));
