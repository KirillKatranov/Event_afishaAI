import { create } from 'zustand';
import {ContentParams} from "@/features/content";
import ContentService from "@/features/content/api/ContentService";
import {Event} from "@/entities/event";

interface EventsState {
  events: Event[];
  isLoading: boolean;
  hasError: boolean;
  swipedAll: boolean;
  fetchEvents: (params: ContentParams) => void;
  addEvent: (event: Event) => void;
  setSwipedAll: (state: boolean) => void;
}

export const useEventsSwiperStore = create<EventsState>((set) => ({
  tag: undefined,
  events: [],
  isLoading: true,
  hasError: false,
  swipedAll: false,

  fetchEvents: (
    params: ContentParams
  ) => {
    set({ isLoading: true, hasError: false });

    ContentService.getContent(params)
      .then((response) => {
        switch (response.status) {
          case 200: {
            console.log(`Successfully get events`);
            if (response.data.length > 0) {
              set({ events: response.data, isLoading: false, swipedAll: false });
            } else {
              console.log(`No events on provided params`);
              set({ isLoading: false, swipedAll: true })
            }
            break;
          }
          default: {
            console.log(`Events request error with code: ${response.status}`);
            set({ hasError: true, isLoading: false });
          }
        }
      })
      .catch((e) => {
        console.log(`Events request error: ${e}`);
        set({ hasError: true, isLoading: false })
      });
  },

  addEvent: (event: Event) => {
    set((state) => {
      return { events: [...state.events, event], swipedAll: false };
    })
  },

  setSwipedAll: async (state: boolean) => {
    set({ swipedAll: state });
  },
}));
