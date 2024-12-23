import { create } from 'zustand';
import {ReactionsParams} from "@/features/likes-dislikes/model/types/likes.types";
import {ActionData} from "@/features/likes-dislikes/model/types/useraction.types";
import likesService from "@/features/likes-dislikes/api/LikesService";
import {Event} from "@/entities/event";

interface ReactionsState {
  likes: Event[];
  dislikes: Event[];
  isLikesLoading: boolean;
  hasLikesError: boolean;
  isDislikesLoading: boolean;
  hasDislikesError: boolean;
  addLikedEvent: (event: Event) => void;
  addDislikedEvent: (event: Event) => void;
  removeLikedEvent: (eventId: number) => void;
  removeDislikedEvent: (eventId: number) => void;
  fetchReactions: (params: ReactionsParams) => void;
  saveAction: (actionData: ActionData) => Promise<void>;
}

export const useReactionsStore = create<ReactionsState>((set, get) => ({
  likes: [],
  dislikes: [],
  isLikesLoading: true,
  hasLikesError: false,
  isDislikesLoading: true,
  hasDislikesError: false,

  addLikedEvent: (event: Event) => {
    const eventExists = get().likes.some((likedEvent) => likedEvent.id === event.id);
    if (eventExists) return

    set((state) => {
      return { likes: [event, ...state.likes] };
    })
  },

  addDislikedEvent: (event: Event) => {
    const eventExists = get().dislikes.some((dislikedEvent) => dislikedEvent.id === event.id);
    if (eventExists) return

    set((state) => {
      return { dislikes: [event, ...state.dislikes] };
    })
  },

  removeLikedEvent: (eventId: number) =>
    set((state) => ({
      likes: state.likes.filter((event) => event.id !== eventId),
    })),

  removeDislikedEvent: (eventId: number) =>
    set((state) => ({
      dislikes: state.dislikes.filter((event) => event.id !== eventId),
    })),


  fetchReactions: async (params: ReactionsParams) => {
    if (params.value) {
      set({ isDislikesLoading: true, hasDislikesError: false });
    } else {
      set({ isLikesLoading: true, hasLikesError: false });
    }

    likesService.getReactions(params)
      .then((response) => {
        switch (response.status) {
          case 200: {
            if (params.value) {
              console.log(`Successfully get disliked events`);
              set({ dislikes: response.data, isDislikesLoading: false });
            } else {
              console.log(`Successfully get liked events`);
              set({ likes: response.data, isLikesLoading: false });
            }

            break;
          }
          default: {
            console.log(`Events request error with code: ${response.status}`);
            if (params.value) {
              set({ isDislikesLoading: false, hasDislikesError: true });
            } else {
              set({ isLikesLoading: false, hasLikesError: true });
            }
          }
        }
      })
      .catch((e) => {
        console.log(`Events request error: ${e}`);
        if (params.value) {
          set({ isDislikesLoading: false, hasDislikesError: true });
        } else {
          set({ isLikesLoading: false, hasLikesError: true });
        }
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
