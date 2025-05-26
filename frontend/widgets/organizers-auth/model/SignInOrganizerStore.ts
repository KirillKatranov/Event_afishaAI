import {create} from "zustand/index";
import {immer} from "zustand/middleware/immer";

interface SignInOrganizerState {
  email: string;
  password: string;
  isLoading: boolean;
  hasError: boolean;
}

interface SignInOrganizerActions {
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  submitSignIn: () => void;
}

const initialState: SignInOrganizerState = {
  email: "",
  password: "",
  isLoading: false,
  hasError: false,
}

export const useSignInOrganizerStore = create<SignInOrganizerState & SignInOrganizerActions>()(
  immer((set, get) => ({
    ...initialState,

    setEmail: (email: string) => set({ email }),
    setPassword: (password: string) => set({ password }),

    submitSignIn: () => {
      const state = get();

      console.log(state);
    }
  }))
);
