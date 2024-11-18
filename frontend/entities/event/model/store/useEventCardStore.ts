import {create} from "zustand";

interface EventCardState {
  descriptionSwiping: boolean;
  descriptionExpanded: boolean;
  setDescriptionSwiping: (newState: boolean) => void;
  setDescriptionExpanded: (newState: boolean) => void;
}

export const useEventCardStore = create<EventCardState>((set) => ({
  descriptionSwiping: false,
  descriptionExpanded: false,

  setDescriptionSwiping: (newState: boolean) => set({ descriptionSwiping: newState }),
  setDescriptionExpanded: (newState: boolean) => set({ descriptionExpanded: newState })
}));
