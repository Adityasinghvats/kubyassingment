export interface User {
    id: string;
    name: string;
    email?: string;
    hourlyRate?: string;
    role?: 'PROVIDER' | 'CLIENT';
    image?: string;
    category?: string;
    bio?: string;
    _count?: { slot: number }
}

export interface SignUpData {
    email: string;
    password: string;
    name: string;
    role?: 'PROVIDER' | 'CLIENT';
    hourlyRate?: string;
}

export interface SignInData {
    email: string;
    password: string;
}