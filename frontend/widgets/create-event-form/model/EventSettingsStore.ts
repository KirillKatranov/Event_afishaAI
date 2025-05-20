import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface EventFormState {
  registrationClosed: boolean;
  eventEnded: boolean;
  duplicateEvent: boolean;
  deleteEvent: boolean;
  blockUsers: boolean;
  blockedUsernames: string[];
}

interface EventFormActions {
  setRegistrationClosed: (registrationClosed: boolean) => void;
  setEventEnded: (eventEnded: boolean) => void;
  setDuplicateEvent: (duplicateEvent: boolean) => void;
  setDeleteEvent: (deleteEvent: boolean) => void;
  setBlockUsers: (blockUsers: boolean) => void;
  addBlockedUsername: () => void;
  removeBlockedUsername: (index: number) => void;
  updateBlockedUsername: (index: number, username: string) => void;
  submitSettings: () => void;
}

const initialState: EventFormState = {
  registrationClosed: false,
  eventEnded: false,
  duplicateEvent: false,
  deleteEvent: false,
  blockUsers: false,
  blockedUsernames: [],
};

export const useEventSettingsStore = create<EventFormState & EventFormActions>()(
  immer((set) => ({
    ...initialState,

    setRegistrationClosed: (registrationClosed) => set({ registrationClosed }),
    setEventEnded: (eventEnded) => set({ eventEnded }),
    setDuplicateEvent: (duplicateEvent) => set({ duplicateEvent }),
    setDeleteEvent: (deleteEvent) => set({ deleteEvent }),
    setBlockUsers: (blockUsers) => set({ blockUsers }),

    addBlockedUsername: () => set((state) => {
      state.blockedUsernames.push("");
    }),

    removeBlockedUsername: (index) => set((state) => {
      state.blockedUsernames.splice(index, 1);
    }),

    updateBlockedUsername: (index, username) => set((state) => {
      state.blockedUsernames[index] = username;
    }),

    submitSettings: () => {
    },
  }))
);
