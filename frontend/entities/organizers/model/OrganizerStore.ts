import {create} from "zustand/index";
import {immer} from "zustand/middleware/immer";

interface OrganizerState {
  isLoading: boolean;
  hasError: boolean;
}

interface OrganizerActions {
}

const initialState: OrganizerState = {
  isLoading: false,
  hasError: false,
}

export const useOrganizerStore = create<OrganizerState & OrganizerActions>()(
  immer((set, get) => ({
    ...initialState,

  }))
);
