import {create} from "zustand";

interface EventCardState {
  likeTrigger: number;
  swipeEnabled: boolean;
  setSwipeEnabled: (state: boolean) => void;
  triggerLikeAnimation: () => void;
}

export const useEventCardStore = create<EventCardState>((set) => ({
  swipeEnabled: true,
  likeTrigger: 0,
  setSwipeEnabled: (state: boolean) => {
    set({ swipeEnabled: state })
  },

  triggerLikeAnimation: () => set((state) => ({ likeTrigger: state.likeTrigger + 1 })),
}));
