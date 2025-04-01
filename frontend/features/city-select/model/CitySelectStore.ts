import { create } from 'zustand';
import {CityID} from "@/features/city-select";
import CityService from "@/features/city-select/api/CityService";
import {useUserStore} from "@/entities/user";

interface CitySelectState {
  citySelected: CityID | undefined;
  availableCities: CityID[] | undefined;
  isLoading: boolean;
  hasError: boolean;
}

interface CitySelectActions {
  getCities: () => void,
  onCitySelected: (city: CityID) => void,
  saveCity: (username: string, onSuccess?: () => void) => void,
}

const initialState: CitySelectState = {
  citySelected: undefined,
  availableCities: undefined,
  isLoading: false, hasError: false
}

export const useCitySelectStore = create<CitySelectState & CitySelectActions>((set, get) => ({
  ...initialState,

  getCities: () => {
    set({ isLoading: true, hasError: false });

    CityService.getCities()
      .then((response) => {
        if (response && response.error) {
          set({ hasError: true })
        } else if (response && response.data) {
          set({ availableCities: response.data.cities, citySelected: response.data.cities[0] })
        }
      })
      .catch(() => {
        set({ hasError: true })
      })
      .finally(() => set({ isLoading: false }));
  },

  onCitySelected: (city) => set({ citySelected: city }),

  saveCity: (username, onSuccess) => {
    set({ isLoading: true, hasError: false });

    CityService.saveCity({ username: username, city: get().citySelected! })
      .then(() => {
        useUserStore.getState().getUser(username);
        if (onSuccess) onSuccess();
      })
      .catch(() => set({ hasError: true }))
      .finally(() => set({ isLoading: false }))
  },
}));
