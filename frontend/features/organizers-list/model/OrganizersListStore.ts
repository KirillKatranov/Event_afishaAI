import {create} from "zustand/index";
import {immer} from "zustand/middleware/immer";
import {Organizer} from "@/entities/organizers";
import OrganizersListService from "@/features/organizers-list/api/OrganizersListService";

interface OrganizersListState {
  organizers: Organizer[] | null;
  totalCount: number;
  isLoading: boolean;
  errorMessage: string | null;
}

interface OrganizersListActions {
  getOrganizers: () => void;
}

const initialState: OrganizersListState = {
  organizers: null,
  totalCount: -1,
  isLoading: false,
  errorMessage: null,
}

export const useOrganizersListStore = create<OrganizersListState & OrganizersListActions>()(
  immer((set, get) => ({
    ...initialState,

    getOrganizers: () => {
      set({ isLoading: false, errorMessage: null });

      OrganizersListService.getOrganizers()
        .then((response) => {
          if (response.data) {
            set({ organizers: response.data.organisations, totalCount: response.data.total_count })
          } else if (response.error) {
            set({ errorMessage: response.error })
          }
        })
        .catch((e) => set({ errorMessage: e.message }))
        .finally(() => set({ isLoading: false }));
    }
  }))
);
