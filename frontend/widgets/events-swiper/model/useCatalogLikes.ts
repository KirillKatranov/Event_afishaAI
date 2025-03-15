import {create} from "zustand";

interface CatalogLikesState {
  likedIDs: number[];
  addLikeID: (id: number) => void;
  removeLikeID: (id: number) => void;
  resetLikesID: () => void;
}

export const useCatalogLikesStore = create<CatalogLikesState>((set) => ({
  likedIDs: [],
  addLikeID: (id: number) => {
    set((state) => ({ likedIDs: [...state.likedIDs, id] }))
  },
  removeLikeID: (id: number) => {
    set((state) => ({ likedIDs: state.likedIDs.filter((val) => val != id) }))
  },
  resetLikesID: () => set({ likedIDs: [] })
}));
