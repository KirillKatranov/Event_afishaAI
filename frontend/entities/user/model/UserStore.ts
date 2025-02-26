import { create } from 'zustand';
import {User} from "@/entities/user";

interface UserState {
  user: User | undefined;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string;
}

interface UserActions {
  getUser: (username: string) => void;
}

const initialState: UserState = {
  user: undefined,
  isLoading: false, hasError: false, errorMessage: "",
}

export const useUserStore = create<UserState & UserActions>((set, get) => ({
  ...initialState,

  getUser: (username) => {
    set({ isLoading: true, hasError: false });

    set({ user: { username: username, city: undefined} });

    set({ isLoading: false });
  },
}));
