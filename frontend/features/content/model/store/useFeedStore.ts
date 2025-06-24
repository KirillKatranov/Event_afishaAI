import { create } from 'zustand';
import {FeedParams, SearchParams} from "@/features/content";
import ContentService from "@/features/content/api/ContentService";
import {Event} from "@/entities/event";

interface FeedState {
  searchQuery: string;
  feed: Event[];
  isLoading: boolean;
  hasError: boolean;
  swipedAll: boolean;
  fetchFeed: (params: FeedParams) => void;
  fetchSearch: (params: SearchParams) => void;
  fetchSuggestions: (query: string) => Promise<string[]>;
  addEvent: (event: Event) => void;
  setSwipedAll: (state: boolean) => void;
  setSearchQuery: (searchQuery: string) => void;
}

export const useFeedStore = create<FeedState>((set) => ({
  feed: [],
  searchQuery: "",
  isLoading: true,
  hasError: false,
  swipedAll: false,

  setSearchQuery: (searchQuery: string) => set({ searchQuery: searchQuery }),

  fetchSearch: (params: SearchParams) => {
    set({ isLoading: true, hasError: false });

    ContentService.searchEvents(params)
      .then((response) => {
        if (response && response.data) {
          if (response.data.data.contents.length > 0) {
            console.log(`Successfully get feed`);
            set({ feed: response.data.data.contents, swipedAll: false });
          } else {
            console.log(`No feed events on provided params`);
            set({ swipedAll: true });
          }
        } else if (response && response.error) {
          set({ hasError: true });
        }
      })
      .catch((e) => {
        console.log(`Feed request error: ${e}`);
        set({ hasError: true })
      })
      .finally(() => set({ isLoading: false }));
  },

  fetchSuggestions: async (query) => {
    const response = await ContentService.searchSuggestions({ q: query })

    if (response && response.data) {
      return response.data.suggestions;
    } else {
      return [response.error]
    }
  },

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
