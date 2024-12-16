import { create } from 'zustand';
import {ContentParams} from "@/features/content";
import ContentService from "@/features/content/api/ContentService";
import {Event} from "@/entities/event";

interface EventsState {
  events: Event[];
  isLoading: boolean;
  hasError: boolean;
  swipedAll: boolean;
  fetchEvents: (tag?: string, date_start?: string, date_end?: string) => void;
  setSwipedAll: (state: boolean) => void;
}

export const useEventsSwiperStore = create<EventsState>((set) => ({
  tag: undefined,
  events: [],
  isLoading: true,
  hasError: false,
  swipedAll: false,

  fetchEvents: (
    tag?: string,
    date_start?: string,
    date_end?: string
  ) => {
    set({ isLoading: true, hasError: false });

    const params: ContentParams = {};
    if (tag)        params.tag = tag;
    if (date_start) params.date_start = date_start;
    if (date_end)   params.date_end = date_end;

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

  setSwipedAll: async (state: boolean) => {
    set({ swipedAll: state });
  },
}));
