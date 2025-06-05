import {create} from "zustand/index";
import {immer} from "zustand/middleware/immer";
import {Organizer} from "@/entities/organizers";
import OrganizersListService from "@/features/organizers-list/api/OrganizersListService";

interface UserOrganizersListState {
  userOrganizers: Organizer[] | null;
  totalCount: number;
  isLoading: boolean;
  errorMessage: string | null;
}

interface UserOrganizersListActions {
  getUserOrganizers: (username: string) => void;
}

const initialState: UserOrganizersListState = {
  userOrganizers: null,
  totalCount: -1,
  isLoading: false,
  errorMessage: null,
}

export const useUserOrganizersListStore = create<UserOrganizersListState & UserOrganizersListActions>()(
  immer((set, get) => ({
    ...initialState,

    getUserOrganizers: (username) => {
      set({ isLoading: false, errorMessage: null });

      OrganizersListService.getUserOrganizers({ username: username })
        .then((response) => {
          if (response.data) {
            // TODO: user organizers
          } else if (response.error) {
            set({ errorMessage: response.error })
          }
        })
        .catch((e) => set({ errorMessage: e.message }))
        .finally(() => set({ isLoading: false }));
    }
  }))
);
