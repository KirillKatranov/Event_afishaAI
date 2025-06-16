import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import OrganizerEventsService from "@/features/organizer-content/api/OrganizerEventsService";

interface EventFormState {
  registrationClosed: boolean;
  eventEnded: boolean;
  duplicateEvent: boolean;
  blockUsers: boolean;
  blockedUsernames: string[];
}

interface EventFormActions {
  setRegistrationClosed: (registrationClosed: boolean) => void;
  setEventEnded: (eventEnded: boolean) => void;
  setDuplicateEvent: (duplicateEvent: boolean) => void;
  setBlockUsers: (blockUsers: boolean) => void;
  addBlockedUsername: () => void;
  removeBlockedUsername: (index: number) => void;
  updateBlockedUsername: (index: number, username: string) => void;
  submitSettings: () => void;
  deleteEvent: (id: string, username: string, callback?: () => void) => void;
}

const initialState: EventFormState = {
  registrationClosed: false,
  eventEnded: false,
  duplicateEvent: false,
  blockUsers: false,
  blockedUsernames: [],
};

export const useEventSettingsStore = create<EventFormState & EventFormActions>()(
  immer((set) => ({
    ...initialState,

    setRegistrationClosed: (registrationClosed) => set({ registrationClosed }),
    setEventEnded: (eventEnded) => set({ eventEnded }),
    setDuplicateEvent: (duplicateEvent) => set({ duplicateEvent }),
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

    deleteEvent: (id, username, callback) => {
      OrganizerEventsService.deleteEvent({ id: id, username: username })
        .then((response) => {
          if (response && response.error) console.log(response.error)
          else {
            if (callback) callback();
          }
        })
        .catch((e) => console.log(e));
    }
  }))
);
