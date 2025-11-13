"use client";
import { userAPI } from "@/services/userService";
import { useQuery } from "@tanstack/react-query";
import ProvidersPage from "@/components/providers-page";

export default function Explore() {

    const providersData = useQuery({
        queryKey: ['providers'],
        queryFn: () => userAPI.getAllProviders(),
    })

    const providers = providersData.data?.data?.providers || [];
    if (providersData.isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-slate-600 dark:text-slate-400">Loading providers...</p>
                </div>
            </div>
        );
    }
    return (
        <>
            <ProvidersPage providers={providers} />
        </>
    )
}