import {create} from "zustand";

interface EventCardState {
  descriptionScrolling: boolean,
  descriptionScrollOnTop: boolean,
  descriptionSwiping: boolean;
  descriptionExpanded: boolean;
  setDescriptionSwiping: (newState: boolean) => void;
  setDescriptionExpanded: (newState: boolean) => void;
  setDescriptionScrolling: (newState: boolean) => void;
  setDescriptionScrollOnTop: (newState: boolean) => void;
}

export const useEventCardStore = create<EventCardState>((set) => ({
  descriptionScrolling: false,
  descriptionScrollOnTop: true,
  descriptionSwiping: false,
  descriptionExpanded: false,

  setDescriptionSwiping: (newState: boolean) => set({ descriptionSwiping: newState }),
  setDescriptionExpanded: (newState: boolean) => set({ descriptionExpanded: newState }),
  setDescriptionScrolling: (newState: boolean) => set({ descriptionScrolling: newState }),
  setDescriptionScrollOnTop: (newState: boolean) => set({ descriptionScrollOnTop: newState }),
}));
