import {create} from "zustand/index";
import {immer} from "zustand/middleware/immer";
import {Route} from "@/features/routes";
import RoutesService from "@/features/routes/api/RoutesService";

interface RoutesState {
  routes: Route[] | undefined;
  totalCount: number;
  isLoading: boolean;
  errorMessage: string | null;
}

interface RoutesActions {
  getRoutes: () => void;
}

const initialState: RoutesState = {
  routes: undefined,
  totalCount: -1,
  isLoading: false,
  errorMessage: null,
}

export const useRoutesStore = create<RoutesState & RoutesActions>()(
  immer((set) => ({
    ...initialState,

    getRoutes: () => {
      set({ isLoading: true, errorMessage: null });

      RoutesService.getRoutes()
        .then((response) => {
          if (response.data) {
            set({ routes: response.data.routes, totalCount: response.data.total_count })
          } else if (response.error) {
            set({ errorMessage: response.error })
          }
        })
        .catch((e) => set({ errorMessage: e.message }))
        .finally(() => set({ isLoading: false }));
    }
  }))
);
