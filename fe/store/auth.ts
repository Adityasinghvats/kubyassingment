import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { User } from '@/interfaces/user/interface';

interface Session {
    user: User;
    session: {
        id: string;
        expiresAt: string;
        token: string;
    };
}

interface AuthState {
    session: Session | null;
    isLoading: boolean;
    setSession: (session: Session | null) => void;
    setLoading: (loading: boolean) => void;
    clearSession: () => void;
    updateUser: (user: Partial<User>) => void;
    hydrated?: boolean;
    setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        immer((set) => ({
            session: null,
            isLoading: true,
            hydrated: false,
            setHydrated: () => set({ hydrated: true }),

            setSession: (session) => set({ session, isLoading: false }),

            setLoading: (loading) => set({ isLoading: loading }),

            clearSession: () => set({ session: null, isLoading: false }),

            updateUser: (updatedUser) => set((state) => {
                if (!state.session) return state;
                return {
                    session: {
                        ...state.session,
                        user: { ...state.session.user, ...updatedUser }
                    }
                };
            }),
        })),
        {
            name: "auth",
            onRehydrateStorage() {
                return (state, error) => {
                    if (!error) state?.setHydrated();
                }
            }
        }
    )
);