import { create } from 'zustand';
import {User} from "@/entities/user";
import UserService from "@/entities/user/api/UserService";

interface UserState {
  user: User | undefined;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string;
}

interface UserActions {
  getUser: (username: string) => void;
  registerUser: (username: string, city: string) => void;
}

const initialState: UserState = {
  user: undefined,
  isLoading: false, hasError: false, errorMessage: "",
}

export const useUserStore = create<UserState & UserActions>((set, get) => ({
  ...initialState,

  getUser: (username) => {
    set({ isLoading: true, hasError: false });

    UserService.getUser({ username: username })
      .then((response) => {
        set({ user: response.data })
      })
      .catch(() => set({ hasError: true }))
      .finally(() => set({ isLoading: false }));

    set({ isLoading: false });
  },

  registerUser: (username, city) => {
    set({ isLoading: true, hasError: false });

    UserService.registerUser({ username: username, city: city })
      .then((response) => {
        if (response.status == 201 || response.status == 400) {
          get().getUser(username)
        }
      })
      .catch((e) => console.log(e.message))
      .finally(() => set({ isLoading: false }));
  }
}));
