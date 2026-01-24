import { LevelHorizontalList } from "@/components/dashboard/LevelHorizontalList";
import { BackButton } from "@/components/ui/BackButton";

export default function LevelsPage() {
    return (
        <main className="min-h-screen bg-[#fafafa]">
            <div className="container mx-auto py-8">
                <div className="mb-8 px-4">
                    <BackButton />
                </div>
                <LevelHorizontalList />
            </div>
        </main>
    );
}
