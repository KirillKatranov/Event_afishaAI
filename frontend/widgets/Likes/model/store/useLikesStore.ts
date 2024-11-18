import { create } from 'zustand';
import {Event} from "@/widgets/Events/model/types/events.types"
import {LikesParams, likesServices} from "@/widgets/Likes";

interface LikesState {
  likes: Event[];
  isLoading: boolean;
  hasError: boolean;
  modalVisible: boolean;
  selectedEvent: number | undefined;
  addLikedEvent: (event: Event) => void;
  removeLikedEvent: (eventId: number) => void;
  fetchLikes: (username: string, date_start?: string, date_end?: string) => void;
  setModalVisible: (visible: boolean) => void;
  setEventSelected: (index: number | undefined ) => void;
}

export const useLikesStore = create<LikesState>((set) => ({
  likes: [],
  isLoading: true,
  hasError: false,
  modalVisible: false,
  selectedEvent: undefined,

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

    likesServices.getLikes(params)
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

  setEventSelected: (index: number | undefined ) => {
    set({ selectedEvent: index });
  },

  setModalVisible: (visible: boolean) => {
    set({ modalVisible: visible });
  }
}));
