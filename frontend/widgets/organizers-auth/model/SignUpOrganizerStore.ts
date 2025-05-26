import {create} from "zustand/index";
import {immer} from "zustand/middleware/immer";

interface SignUpOrganizerState {
  organizationName: string;
  phoneNumber: string;
  email: string;
  password: string;
  isLoading: boolean;
  hasError: boolean;
}

interface SignUpOrganizerActions {
  setOrganizationName: (organizationName: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  submitSignUp: () => void;
}

const initialState: SignUpOrganizerState = {
  organizationName: "",
  phoneNumber: "",
  email: "",
  password: "",
  isLoading: false,
  hasError: false,
}

export const useSignUpOrganizerStore = create<SignUpOrganizerState & SignUpOrganizerActions>()(
  immer((set, get) => ({
    ...initialState,

    setOrganizationName: (organizationName: string) => set({ organizationName }),
    setPhoneNumber: (phoneNumber: string) => set({ phoneNumber }),
    setEmail: (email: string) => set({ email }),
    setPassword: (password: string) => set({ password }),

    submitSignUp: () => {
      const state = get()

      console.log(state);
    }
  }))
);
