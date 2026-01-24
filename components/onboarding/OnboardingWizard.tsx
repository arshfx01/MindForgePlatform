"use client";

import { useEffect, useState } from "react";
import { generateOnboardingQuestions, evaluateOnboarding, type OnboardingQuestion } from "@/services/ai/oracle";
import { useGameStore } from "@/store/gameStore";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";


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
    const [clickingIndex, setClickingIndex] = useState<number | null>(null);

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
        setClickingIndex(index);
        const currentQ = questions[currentStep];
        const newAnswers = [...answers, { questionId: currentQ.id, answerIndex: index }];
        setAnswers(newAnswers);

        if (currentStep < questions.length - 1) {
            const nextStep = currentStep + 1;
            setCurrentStep(nextStep);
            // Save progress to DB
            await updateProfile({ onboardingStep: nextStep });
            setClickingIndex(null);
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
        <div className="max-w-2xl mx-auto p-4 md:p-6 bg-card border border-border rounded-xl shadow-lg mt-4 md:mt-10">
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

            <div className="space-y-4">
                {currentQ.options.map((option, idx) => (
                    <Button
                        key={idx}
                        variant="outline"
                        loading={clickingIndex === idx}
                        onClick={() => handleSelect(idx)}
                        className="w-full h-auto text-left p-6 justify-start font-normal items-start group shadow-sm hover:shadow-md transition-all border-border/60 hover:border-primary/40 bg-background/50"
                    >
                        <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border border-muted-foreground group-hover:border-primary flex items-center justify-center mr-4 transition-colors">
                            <div className="w-2.5 h-2.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-sm md:text-base whitespace-normal">{option}</span>
                    </Button>
                ))}

            </div>

        </div>
    );
}
