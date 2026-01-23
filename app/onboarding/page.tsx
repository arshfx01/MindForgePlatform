"use client";

import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

export default function OnboardingPage() {
    return (
        <div className="min-h-screen bg-background p-4">
            <header className="max-w-7xl mx-auto py-8">
                <h1 className="text-3xl font-bold text-center mb-2">Initialize Profile</h1>
                <p className="text-center text-muted-foreground">
                    Complete this assessment to unlock your logical baseline.
                </p>
            </header>
            <OnboardingWizard />
        </div>
    );
}
