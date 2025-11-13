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
    return (
        <>
            <ProvidersPage providers={providers} />
        </>
    )
}