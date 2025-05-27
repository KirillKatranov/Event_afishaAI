import {create} from "zustand/index";
import {immer} from "zustand/middleware/immer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AsyncStorageKeys} from "@/shared/constants";

interface OrganizerState {
  isAuthenticated: boolean | null;
  showSignUp: boolean;
  isLoading: boolean;
  hasError: boolean;
}

interface OrganizerActions {
  setShowSignUp: (showSignUp: boolean) => void;
  submitSignIn: () => void;
  submitSignUp: () => void;
  checkAuthenticated: () => Promise<void>;
}

const initialState: OrganizerState = {
  isAuthenticated: null,
  showSignUp: false,
  isLoading: false,
  hasError: false,
}

export const useOrganizerStore = create<OrganizerState & OrganizerActions>()(
  immer((set, get) => ({
    ...initialState,

    setShowSignUp: (showSignUp: boolean) => set({ showSignUp }),

    submitSignIn: () => {
      const state = get();

      console.log(state);
    },

    submitSignUp: () => {
      const state = get();

      console.log(state);
    },

    checkAuthenticated: async () => {
      try {
        const storedAuth = await AsyncStorage.getItem(AsyncStorageKeys.isOrganizerAuthenticated);
        if (storedAuth) {
          const isAuthenticated = storedAuth === "true";
          set({ isAuthenticated });
        }
      } catch (error) {
        console.error('Failed to check auth:', error);
      }
    }
  }))
);
