import { StreakCalendar } from "@/components/dashboard/StreakCalendar";
import { BackButton } from "@/components/ui/BackButton";

export default function StreakPage() {
    return (
        <main className="min-h-screen bg-[#fafafa]">
            <div className="container mx-auto py-8">
                <div className="mb-8 px-4">
                    <BackButton />
                </div>
                <StreakCalendar />
            </div>
        </main>
    );
}
