'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { userAPI } from '@/services/userService';
import { useRouter } from 'next/navigation';

export function useAuth() {
    const { session, isLoading, setSession, setLoading, clearSession } = useAuthStore();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const sessionData = await userAPI.getSession();
                if (sessionData) {
                    setSession(sessionData);
                } else {
                    clearSession();
                }
            } catch (error) {
                console.error('Session check failed:', error);
                clearSession();
            }
        };

        checkSession();
    }, [setSession, clearSession]);

    const signUp = async (data: {
        email: string;
        password: string;
        name: string;
        role?: 'PROVIDER' | 'CLIENT';
        hourlyRate?: string;
    }) => {
        setLoading(true);
        try {
            const result = await userAPI.signUp(data);
            setSession(result);
            return result;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const signIn = async (email: string, password: string) => {
        setLoading(true);
        try {
            const result = await userAPI.signIn({ email, password });
            setSession(result);
            return result;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await userAPI.signOut();
            clearSession();
        } catch (error) {
            console.error('Sign out failed:', error);
            clearSession();
        }
    };

    return {
        session,
        isLoading,
        isAuthenticated: !!session,
        user: session?.user,
        signUp,
        signIn,
        signOut,
    };
}