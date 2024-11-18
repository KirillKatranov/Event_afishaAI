import { create } from 'zustand';
import {LikesParams} from "@/features/likes-dislikes/model/types/likes.types";
import likesService from "@/features/likes-dislikes/api/LikesService";
import {Event} from "@/entities/event";

interface LikesState {
  likes: Event[];
  isLoading: boolean;
  hasError: boolean;
  addLikedEvent: (event: Event) => void;
  removeLikedEvent: (eventId: number) => void;
  fetchLikes: (username: string, date_start?: string, date_end?: string) => void;
  saveAction: (action: "like" | "dislike", id: number, username: string) => Promise<void>;
}

export const useLikesStore = create<LikesState>((set) => ({
  likes: [],
  isLoading: true,
  hasError: false,

  addLikedEvent: (event) =>
    set((state) => {
      const updatedLikedEvents = [...state.likes, event];
      updatedLikedEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      return { likes: updatedLikedEvents };
    }),

  removeLikedEvent: (eventId) =>
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
    action,
    id,
    username
  ) => {

    await likesService.postAction({action: action, username: username, contentId: id})
      .then((response) => {
        if (response.status === 200) {
          console.log(`Successfully post like/dislike`);
        } else {
          console.log(`Error in posting like/dislike with code: ${response.status}`);
        }
      })
      .catch((e) => {
        console.log(`Error posting like/dislike with error: ${e}`);
      })
  },
}));
