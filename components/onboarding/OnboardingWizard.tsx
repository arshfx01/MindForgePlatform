"use client";

import { useEffect, useState } from "react";
import { generateOnboardingQuestions, evaluateOnboarding, type OnboardingQuestion } from "@/services/ai/oracle";
import { useGameStore } from "@/store/gameStore";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function OnboardingWizard() {
    const {
        userId,
        setUserId,
        updateProfile,
        onboardingQuestions,
        onboardingStep,
        fetchProfile
    } = useGameStore();

    const [questions, setQuestions] = useState<OnboardingQuestion[]>(onboardingQuestions);
    const [currentStep, setCurrentStep] = useState(onboardingStep);
    const [answers, setAnswers] = useState<{ questionId: number; answerIndex: number }[]>([]);
    const [loading, setLoading] = useState(!onboardingQuestions.length);
    const [analyzing, setAnalyzing] = useState(false);

    const router = useRouter();
    const { user } = useUser();

    useEffect(() => {
        if (user) {
            setUserId(user.id);
            fetchProfile();
        }
    }, [user]);

    useEffect(() => {
        if (onboardingQuestions.length > 0) {
            setQuestions(onboardingQuestions);
            setCurrentStep(onboardingStep);
            setLoading(false);
            return;
        }

        async function init() {
            setLoading(true);
            const q = await generateOnboardingQuestions();
            setQuestions(q);
            await updateProfile({ onboardingQuestions: q, onboardingStep: 0 });
            setLoading(false);
        }

        if (userId) init();
    }, [userId, onboardingQuestions.length]);

    const handleSelect = async (index: number) => {
        const currentQ = questions[currentStep];
        const newAnswers = [...answers, { questionId: currentQ.id, answerIndex: index }];
        setAnswers(newAnswers);

        if (currentStep < questions.length - 1) {
            const nextStep = currentStep + 1;
            setCurrentStep(nextStep);
            // Save progress to DB
            await updateProfile({ onboardingStep: nextStep });
        } else {
            // Finished
            setAnalyzing(true);
            const result = await evaluateOnboarding(newAnswers);

            await updateProfile({
                level: result.level,
                stats: result.stats,
                onboardingCompleted: true,
                xp: 100 // Welcome bonus
            });

            router.push("/dashboard");
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Consulting the Oracle...</p>
            </div>
        );
    }

    if (analyzing) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-lg font-medium">Calibrating your Cognitive Profile...</p>
                <p className="text-sm text-muted-foreground">Analyzing logic patterns...</p>
            </div>
        );
    }

    const currentQ = questions[currentStep];

    return (
        <div className="max-w-2xl mx-auto p-6 bg-card border border-border rounded-xl shadow-lg mt-10">
            <div className="mb-8">
                <div className="flex justify-between text-xs uppercase text-muted-foreground mb-2">
                    <span>Assessment Protocol</span>
                    <span>{currentStep + 1} / {questions.length}</span>
                </div>
                <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                    />
                </div>
            </div>

            <h2 className="text-xl font-semibold mb-6 leading-relaxed">
                {currentQ.scenario}
            </h2>

            <div className="space-y-3">
                {currentQ.options.map((option, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleSelect(idx)}
                        className="w-full text-left p-4 rounded-lg border border-border hover:bg-muted/50 hover:border-primary/50 transition-all group flex items-start gap-4"
                    >
                        <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border border-muted-foreground group-hover:border-primary flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-sm md:text-base">{option}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
