export interface User {
    id: string;
    name: string;
    email?: string;
    hourlyRate?: string;
    role?: 'PROVIDER' | 'CLIENT';
    image?: string;
    category?: Category;
    description?: string;
    _count?: { slot: number }
}

export interface SignUpData {
    email: string;
    password: string;
    name: string;
    role?: 'PROVIDER' | 'CLIENT';
    hourlyRate?: string;
    category?: Category;
    description?: string;
}

export interface SignInData {
    email: string;
    password: string;
}

export enum Category {
    PLUMBING = 'PLUMBING',
    ELECTRICAL = 'ELECTRICAL',
    CARPENTRY = 'CARPENTRY',
    CLEANING = 'CLEANING',
    TUTORING = 'TUTORING',
    CONSULTING = 'CONSULTING',
    HEALTHCARE = 'HEALTHCARE',
    LEGAL = 'LEGAL',
    OTHER = 'OTHER',
}