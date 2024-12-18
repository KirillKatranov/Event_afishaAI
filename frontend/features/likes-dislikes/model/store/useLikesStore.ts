import { create } from 'zustand';
import {LikesParams} from "@/features/likes-dislikes/model/types/likes.types";
import {ActionData} from "@/features/likes-dislikes/model/types/useraction.types";
import likesService from "@/features/likes-dislikes/api/LikesService";
import {Event} from "@/entities/event";

interface LikesState {
  likes: Event[];
  isLoading: boolean;
  hasError: boolean;
  addLikedEvent: (event: Event) => void;
  removeLikedEvent: (eventId: number) => void;
  fetchLikes: (username: string, date_start?: string, date_end?: string) => void;
  saveAction: (actionData: ActionData) => Promise<void>;
}

export const useLikesStore = create<LikesState>((set) => ({
  likes: [],
  isLoading: true,
  hasError: false,

  addLikedEvent: (event: Event) =>
    set((state) => {
      const eventExists = state.likes.some((likedEvent) => likedEvent.id === event.id);

      if (eventExists) { return state }

      const updatedLikedEvents = [...state.likes, event];
      updatedLikedEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      return { likes: updatedLikedEvents };
    }),

  removeLikedEvent: (eventId: number) =>
    set((state) => ({
      likes: state.likes.filter((event) => event.id !== eventId),
    })),

  fetchLikes: async (
    username: string,
    date_start?: string,
    date_end?: string
  ) => {
    set({ isLoading: true, hasError: false });

    const params: LikesParams = { username: username };
    if (date_start) params.date_start = date_start;
    if (date_end)   params.date_end = date_end;

    likesService.getLikes(params)
      .then((response) => {
        switch (response.status) {
          case 200: {
            console.log(`Successfully get liked events`);
            set({ likes: response.data, isLoading: false });
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

  saveAction: async (
    actionData: ActionData
  ) => {

    await likesService.postAction(actionData)
      .then((response) => {
        if (response.status === 200) {
          console.log(`Successfully post ${actionData.action}`);
        } else {
          console.log(`Error in posting ${actionData.action} with code: ${response.status}`);
        }
      })
      .catch((e) => {
        console.log(`Error posting ${actionData.action} with error: ${e}`);
      })
  },
}));
