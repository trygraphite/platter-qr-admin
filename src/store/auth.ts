import { set } from "zod/v4";
import { create } from 'zustand'

interface AuthStoreInterface {
  user: any | null;
  isLoggedIn: boolean;
  setUser: (payload: AuthStoreInterface["user"]) => void;
}

const initialState: Omit<AuthStoreInterface, "setUser"> = {
  user: null,
  isLoggedIn: false,
};

export const useAuthStore = create<AuthStoreInterface>((set) => ({
  ...initialState,
  setUser: (payload) => set(() => ({ user: payload })),
}));
