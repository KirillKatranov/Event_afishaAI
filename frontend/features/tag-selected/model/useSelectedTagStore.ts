import { create } from 'zustand';

interface SelectedTagState {
  tag: string | undefined;
  setTag: (newTag: string | undefined) => void;
}

export const useSelectedTagStore = create<SelectedTagState>((set) => ({
  tag: undefined,

  setTag: (newTag: string | undefined) => {
    set({ tag: newTag});
  },
}));
