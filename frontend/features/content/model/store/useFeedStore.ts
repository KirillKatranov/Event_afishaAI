import { create } from 'zustand';
import {FeedParams} from "@/features/content";
import ContentService from "@/features/content/api/ContentService";
import {Event} from "@/entities/event";

interface FeedState {
  feed: Event[];
  isLoading: boolean;
  hasError: boolean;
  swipedAll: boolean;
  fetchFeed: (params: FeedParams) => void;
  addEvent: (event: Event) => void;
  setSwipedAll: (state: boolean) => void;
}

export const useFeedStore = create<FeedState>((set) => ({
  feed: [],
  isLoading: true,
  hasError: false,
  swipedAll: false,

  fetchFeed: (params: FeedParams) => {
    set({ isLoading: true, hasError: false });

    ContentService.getFeed(params)
      .then((response) => {
        switch (response.status) {
          case 200: {
            console.log(`Successfully get feed`);
            if (response.data.length > 0) {
              set({ feed: response.data, isLoading: false, swipedAll: false });
            } else {
              console.log(`No feed events on provided params`);
              set({ isLoading: false, swipedAll: true });
            }
            break;
          }
          default: {
            console.log(`Feed request error with code: ${response.status}`);
            set({ hasError: true, isLoading: false });
          }
        }
      })
      .catch((e) => {
        console.log(`Feed request error: ${e}`);
        set({ hasError: true, isLoading: false })
      });
  },

  addEvent: (event: Event) => {
    set((state) => {
      return { events: [...state.feed, event], swipedAll: false };
    })
  },

  setSwipedAll: async (state: boolean) => {
    set({ swipedAll: state });
  },
}));
