import {create} from "zustand";

interface EventCardState {
  swipeEnabled: boolean;
  setSwipeEnabled: (state: boolean) => void;
}

export const useEventCardStore = create<EventCardState>((set) => ({
  swipeEnabled: true,
  setSwipeEnabled: (state: boolean) => {
    set({ swipeEnabled: state })
  },
}));
