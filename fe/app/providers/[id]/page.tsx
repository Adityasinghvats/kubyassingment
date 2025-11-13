import SlotsPage from "@/components/slots-page";

export default async function ProviderSlotsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    return (
        <SlotsPage providerId={id} />
    )
}
