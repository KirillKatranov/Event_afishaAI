import { create } from 'zustand';

interface LikedEventListState {
  modalVisible: boolean;
  selectedEvent: number | undefined;
  setModalVisible: (visible: boolean) => void;
  setEventSelected: (index: number | undefined ) => void;
}

export const useLikedEventListStore = create<LikedEventListState>((set) => ({
  modalVisible: false,
  selectedEvent: undefined,

  setEventSelected: (index: number | undefined ) => {
    set({ selectedEvent: index });
  },

  setModalVisible: (visible: boolean) => {
    set({ modalVisible: visible });
  }
}));
