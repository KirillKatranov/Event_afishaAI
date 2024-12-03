import {create} from "zustand";

interface EventCardState {
  tagsScrolling: boolean;
  descriptionScrolling: boolean;
  descriptionScrollOnTop: boolean;
  descriptionSwiping: boolean;
  descriptionExpanded: boolean;
  setTagsScrolling: (newState: boolean) => void;
  setDescriptionSwiping: (newState: boolean) => void;
  setDescriptionExpanded: (newState: boolean) => void;
  setDescriptionScrolling: (newState: boolean) => void;
  setDescriptionScrollOnTop: (newState: boolean) => void;
}

export const useEventCardStore = create<EventCardState>((set) => ({
  tagsScrolling: false,
  descriptionScrolling: false,
  descriptionScrollOnTop: true,
  descriptionSwiping: false,
  descriptionExpanded: false,

  setTagsScrolling: (newState: boolean) => set({ tagsScrolling: newState }),
  setDescriptionSwiping: (newState: boolean) => set({ descriptionSwiping: newState }),
  setDescriptionExpanded: (newState: boolean) => set({ descriptionExpanded: newState }),
  setDescriptionScrolling: (newState: boolean) => set({ descriptionScrolling: newState }),
  setDescriptionScrollOnTop: (newState: boolean) => set({ descriptionScrollOnTop: newState }),
}));
