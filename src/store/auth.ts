import { create } from 'zustand'
import { LoginAccountData } from '@/types/apiResponse/auth.payload'

interface AuthStoreInterface {
  user: LoginAccountData | null;
  isLoggedIn: boolean;
  setUser: (payload: AuthStoreInterface["user"]) => void;
}

const initialState: Omit<AuthStoreInterface, "setUser"> = {
  user: null,
  isLoggedIn: false,
};

export const useAuthStore = create<AuthStoreInterface>((set) => ({
  ...initialState,
  setUser: (payload) => set(() => ({ user: payload, isLoggedIn: !!payload })),
}));
