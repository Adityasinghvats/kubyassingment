"use client"

import { useRequireAuth } from "@/hooks/use-auth";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const { session, isLoading } = useRequireAuth('PROVIDER');
    if (isLoading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="text-slate-600 dark:text-slate-400">Loading...</div>
            </div>
        );
    }

    if (!session) {
        return null;
    }
    return (
        <div>{children}</div>
    );
}