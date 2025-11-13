const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
import { SignInData, SignUpData } from '@/interfaces/user/interface';

export const userAPI = {
    signUp: async (data: SignUpData) => {
        const response = await fetch(`${BACKEND_URL}/api/v1/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Sign up failed');
        }

        return response.json();
    },

    signIn: async (data: SignInData) => {
        const response = await fetch(`${BACKEND_URL}/api/auth/sign-in/email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Sign in failed');
        }

        return response.json();
    },

    signOut: async () => {
        const response = await fetch(`${BACKEND_URL}/api/auth/sign-out`, {
            method: 'POST',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Sign out failed');
        }

        return response.json();
    },

    getSession: async () => {
        const response = await fetch(`${BACKEND_URL}/api/auth/get-session`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            return null;
        }

        return response.json();
    },

    getCurrentUser: async () => {
        const response = await fetch(`${BACKEND_URL}/api/v1/users/me`, {
            credentials: 'include',
        });

        if (!response.ok) {
            return null;
        }

        return response.json();
    },

    getAllProviders: async () => {
        const response = await fetch(`${BACKEND_URL}/api/v1/users/providers`, {
            method: 'GET',
            credentials: 'include',
        });
        if (!response.ok) {
            return null;
        }
        return response.json();
    },

    updateProfile: async (data: { name?: string; hourlyRate?: string; }) => {
        const response = await fetch(`${BACKEND_URL}/api/users/me`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update profile');
        }

        return response.json();
    },
};

export const userService = userAPI;