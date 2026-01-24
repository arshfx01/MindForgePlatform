import { EnergyDetail } from "@/components/dashboard/EnergyDetail";
import { BackButton } from "@/components/ui/BackButton";

export default function EnergyPage() {
    return (
        <main className="min-h-screen bg-[#fafafa]">
            <div className="container mx-auto py-8">
                <div className="mb-8 px-4">
                    <BackButton />
                </div>
                <EnergyDetail />
            </div>
        </main>
    );
}
