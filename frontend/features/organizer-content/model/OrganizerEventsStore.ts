import {create} from "zustand/index";
import {immer} from "zustand/middleware/immer";
import {Event} from "@/entities/event"
import OrganizerEventsService from "@/features/organizer-content/api/OrganizerEventsService";

interface OrganizerEventsState {
  events?: Event[];
  totalCount?: number;
  organizerName?: string;
  swipedAll: boolean;
  isLoading: boolean;
  errorMessage?: string;
}

interface OrganizerEventsActions {
  getEvents: (type: "organization" | "user", id: string) => void;
  setSwipedAll: (swiped: boolean) => void;
}

const initialState: OrganizerEventsState = {
  swipedAll: false,
  isLoading: false,
}

export const useOrganizerEventsStore = create<OrganizerEventsState & OrganizerEventsActions>()(
  immer((set) => ({
    ...initialState,

    getEvents: (type, id) => {
      set({ isLoading: true, errorMessage: undefined })

      if (type == "organization") {
        OrganizerEventsService.getOrganizationEvents({ id })
          .then((response) => {
            if (response.data) {
              set({ events: response.data.contents, swipedAll: false })
              if (response.data.contents.length == 0) set({ swipedAll: true })
            } else if (response.error) {
              set({ errorMessage: response.error })
            }
          })
          .catch((e) => set({ errorMessage: e.message }))
          .finally(() => set({ isLoading: false }));
      } else {
        OrganizerEventsService.getUserEvents({ id })
          .then((response) => {
            console.log(response);
            if (response.data) {
              set({ events: response.data, organizerName: id, swipedAll: false })
              if (response.data.length == 0) set({ swipedAll: true })
            } else if (response.error) {
              set({ errorMessage: response.error })
            }
          })
          .catch((e) => set({ errorMessage: e.message }))
          .finally(() => set({ isLoading: false }));
      }
    },

    setSwipedAll: (swiped) => set({ swipedAll: swiped })
  }))
);
