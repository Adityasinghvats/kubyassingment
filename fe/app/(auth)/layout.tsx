'use client';

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const router = useRouter();
    const { session, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && session) {
            router.push("/profile");
        }
    }, [session, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (session) {
        return null;
    }

    return <div>{children}</div>;
}
