import {create} from "zustand/index";
import {immer} from "zustand/middleware/immer";
import OrganizersAuthService from "@/widgets/organizers-auth/api/OrganizersAuthService";

interface SignUpOrganizerState {
  organizationName: string;
  phoneNumber: string;
  email: string;
  password: string;
  image: File | undefined;
  isFormValid: boolean;
  isLoading: boolean;
  errorMessage?: string;
}

interface SignUpOrganizerActions {
  setOrganizationName: (organizationName: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setImage: (image: File | undefined) => void;
  checkIsFormValid: () => void;
  submitSignUp: (username: string, onSuccess?: () => void) => void;
  resetForm: () => void;
}

const initialState: SignUpOrganizerState = {
  organizationName: "",
  phoneNumber: "",
  email: "",
  password: "",
  image: undefined,
  isFormValid: false,
  isLoading: false,
}

export const useSignUpOrganizerStore = create<SignUpOrganizerState & SignUpOrganizerActions>()(
  immer((set,get) => ({
    ...initialState,

    checkIsFormValid: () => {
      const state = get();
      set({ isFormValid: state.organizationName !== "" && state.email !== "" && state.phoneNumber !== "" && state.password !== "" });
    },

    setOrganizationName: (organizationName: string) => { set({ organizationName }); get().checkIsFormValid() },
    setPhoneNumber: (phoneNumber: string) => { set({ phoneNumber }); get().checkIsFormValid() },
    setEmail: (email: string) => { set({ email }); get().checkIsFormValid() },
    setPassword: (password: string) => { set({ password }); get().checkIsFormValid() },
    setImage: (image: File | undefined) =>{ set({ image }); get().checkIsFormValid() },

    submitSignUp: (username, onSuccess) => {
      set({ isLoading: true, errorMessage: undefined });

      OrganizersAuthService.organizerRegister({
        username: username,
        data: {
          name: get().organizationName,
          email: get().email,
          password: get().password,
          phone: get().phoneNumber,
          image: get().image,
        }
      })
        .then((response) => {
          if (response && response.error) {
            set({ errorMessage: response.error });
          } else {
            if (onSuccess) onSuccess();
            get().resetForm();
          }
        })
        .catch((e) => set({ errorMessage: e.message }))
        .finally(() => set({ isLoading: false }))
    },

    resetForm: () => set(initialState),
  }))
);
