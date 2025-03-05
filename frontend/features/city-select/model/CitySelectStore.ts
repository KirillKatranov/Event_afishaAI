import { create } from 'zustand';
import {City} from "@/features/city-select";

interface CitySelectState {
  citySelected: City | undefined;
  cities: City[] | undefined;
  isLoading: boolean;
  hasError: boolean;
}

interface CitySelectActions {
  getCities: (username: string) => void,
  onCitySelected: (city: City) => void,
  saveCity: (username: string) => void,
}

const initialState: CitySelectState = {
  citySelected: undefined,
  cities: undefined,
  isLoading: false, hasError: false
}

export const useCitySelectStore = create<CitySelectState & CitySelectActions>((set, get) => ({
  ...initialState,

  getCities: (username) => {
    set({ isLoading: true, hasError: false });

    console.log(username);

    set({ cities: [
        { id: "msk", name: "Москва", image: "https://cdn.culture.ru/images/0ed8639c-ed61-5cf3-af66-2fc0015e2ce5" },
        { id: "nn", name: "Нижний Новгород", image: "https://i.pinimg.com/originals/29/16/6d/29166dcfbb40d7199c0f08cb4734a007.jpg" },
      ], citySelected: { id: "msk", name: "Москва", image: "https://cdn.culture.ru/images/0ed8639c-ed61-5cf3-af66-2fc0015e2ce5" } })

    set({ isLoading: false });
  },

  onCitySelected: (city) => set({ citySelected: city }),

  saveCity: (username) => {

  },
}));
