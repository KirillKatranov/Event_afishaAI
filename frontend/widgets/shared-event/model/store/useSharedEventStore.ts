import { create } from 'zustand';
import {Event} from "@/entities/event";
import ContentService from "@/features/content/api/ContentService";

interface SharedEventState {
  event: Event | undefined;
  isLoading: boolean;
  hasError: boolean;
  getEvent: (id: string | number) => void;
}

export const useSharedEventStore = create<SharedEventState>((set) => ({
  event: undefined,
  isLoading: true,
  hasError: false,

  getEvent: (id: string | number) => {
    set({ isLoading: true })

    ContentService.getSingleEvent(id)
      .then((response) => {
        switch (response.status) {
          case 200: {
            console.log("Successfully get shared event");
            set({ event: response.data })
            break
          }
          default: {
            console.log(`Events request error with code: ${response.status}`);
            set({ hasError: true });
          }
        }
      })
      .catch((e) => {
        console.log(`Events request error: ${e}`);
        set({ hasError: true })
      })
      .finally(() => set({ isLoading: false }))
  }
}));
