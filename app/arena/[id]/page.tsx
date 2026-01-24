"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useGameState } from "@/contexts/GameStateContext";
import { evaluateReasoning } from "@/app/actions";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Sparkles, Trophy } from "lucide-react";

const scenarios: Record<
  string,
  {
    title: string;
    narrative: string;
    keyVariables: string[];
  }
> = {
  "1": {
    title: "The Ethical Dilemma",
    narrative: `A pharmaceutical company has developed a life-saving drug that costs $100,000 per treatment. The drug can save thousands of lives, but the company's pricing strategy means only the wealthy can afford it. The CEO must decide whether to:

1. Keep the current pricing to maximize shareholder returns and fund future research
2. Implement a tiered pricing model based on income
3. License the formula to generic manufacturers at a loss

The board is pressuring for option 1, citing fiduciary responsibility. Public health advocates demand option 3. The company's research division needs funding from option 1 to continue developing treatments for rare diseases.`,
    keyVariables: [
      "Fiduciary responsibility to shareholders",
      "Public health impact and accessibility",
      "Long-term research funding needs",
      "Regulatory and political pressure",
      "Moral obligation vs. business sustainability",
    ],
  },
  "2": {
    title: "The Logical Paradox",
    narrative: `A small town has a voting system where citizens vote on whether to implement a new policy. The policy states: "This policy will only be implemented if a majority votes against it." 

If 60% vote "No" (against), the policy is implemented. If 60% vote "Yes" (for), the policy is not implemented. This creates a logical loop where:
- Voting "No" to prevent implementation actually causes implementation
- Voting "Yes" to support implementation actually prevents it

Analyze the logical structure, identify the paradox, and propose a resolution that maintains democratic principles while avoiding the contradiction.`,
    keyVariables: [
      "Self-referential logical structure",
      "Voter intent vs. outcome",
      "Democratic voting principles",
      "Paradox resolution mechanisms",
      "Meta-logical constraints",
    ],
  },
  "3": {
    title: "The Cognitive Bias",
    narrative: `A tech startup is evaluating two candidates for a critical engineering role. Candidate A graduated from a prestigious university, has 10 years at a FAANG company, and comes highly recommended by a board member. Candidate B is self-taught, has 5 years of experience at smaller companies, but has built impressive open-source projects that directly relate to the startup's needs.

The hiring manager feels strongly that Candidate A is the "safer" choice and aligns with the company's "high standards." However, the technical team has concerns about Candidate A's ability to adapt to a fast-paced startup environment, while they're excited about Candidate B's demonstrated problem-solving skills.

Identify the cognitive biases at play and analyze which candidate might actually be the better fit.`,
    keyVariables: [
      "Authority bias (prestigious university/company)",
      "Anchoring bias (10 years vs. 5 years)",
      "Confirmation bias (board member recommendation)",
      "Risk aversion vs. innovation needs",
      "Signaling vs. actual competence",
    ],
  },
};

export default function ArenaPage() {
  const params = useParams();
  const router = useRouter();
  const scenarioId = params.id as string;
  const scenario = scenarios[scenarioId];
  const { addXP, unlockScenario } = useGameState();

  const [analysis, setAnalysis] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    score: number;
    feedbackMarkdown: string;
    fallaciesArray: string[];
    xpAwarded: number;
  } | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);

  if (!scenario) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Scenario Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/dashboard")}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!analysis.trim()) return;

    setIsSubmitting(true);
    try {
      const result = await evaluateReasoning(analysis);
      setFeedback(result);
      addXP(result.xpAwarded);
      if (result.score >= 80) {
        const nextScenarioId = String(parseInt(scenarioId) + 1);
        if (nextScenarioId in scenarios) {
          unlockScenario(nextScenarioId);
        }
      }
      setShowOverlay(true);
    } catch (error) {
      console.error("Error evaluating reasoning:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>{scenario.title}</CardTitle>
            <CardDescription>Read the scenario carefully</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-neutral max-w-none">
              <p className="text-foreground/80 whitespace-pre-line leading-relaxed">
                {scenario.narrative}
              </p>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-3 text-primary">Key Variables</h4>
              <ul className="space-y-2">
                {scenario.keyVariables.map((variable, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-foreground/80"
                  >
                    <span className="text-primary mt-1">•</span>
                    <span>{variable}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Analysis</CardTitle>
            <CardDescription>
              Provide your critical analysis below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              value={analysis}
              onChange={(e) => setAnalysis(e.target.value)}
              placeholder="Type your analysis here... Consider the key variables, identify logical fallacies, ethical implications, and propose a reasoned conclusion."
              className="w-full h-96 p-6 bg-muted/30 border border-border rounded-2xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none shadow-inner"
            />
          </CardContent>

        </Card>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleSubmit}
          disabled={!analysis.trim() || isSubmitting}
          loading={isSubmitting}
          size="lg"
          className="px-8"
        >
          Submit to AI Oracle
        </Button>
      </div>


      <AnimatePresence>
        {showOverlay && feedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowOverlay(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-[2.5rem] p-10 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >

              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-4">
                    AI Oracle Feedback
                  </h2>

                  <div className="relative inline-block mb-6">
                    <svg
                      className="w-48 h-48 transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={
                          feedback.score >= 80
                            ? "#10b981"
                            : feedback.score >= 60
                              ? "#f59e0b"
                              : "#ef4444"
                        }
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 45}`}
                        strokeDashoffset={`${2 * Math.PI * 45 * (1 - feedback.score / 100)
                          }`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-primary">
                          {feedback.score}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Score
                        </div>
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2">
                      {feedback.score >= 80 ? (
                        <Trophy className="h-8 w-8 text-amber-400" />
                      ) : feedback.score >= 60 ? (
                        <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                      ) : (
                        <XCircle className="h-8 w-8 text-red-400" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Alert variant="success">
                    <Sparkles className="h-4 w-4" />
                    <AlertTitle>Strengths</AlertTitle>
                    <AlertDescription>
                      {feedback.feedbackMarkdown
                        .split("Strengths:")[1]
                        ?.split("Logical Fallacies:")[0] ||
                        "Your analysis shows good critical thinking."}
                    </AlertDescription>
                  </Alert>

                  {feedback.fallaciesArray.length > 0 && (
                    <Alert variant="warning">
                      <XCircle className="h-4 w-4" />
                      <AlertTitle>Logical Fallacies Found</AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc list-inside space-y-1">
                          {feedback.fallaciesArray.map((fallacy, index) => (
                            <li key={index}>{fallacy}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Strategic Pivot</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/80">
                      {feedback.feedbackMarkdown.split("Strategic Pivot:")[1] ||
                        feedback.feedbackMarkdown}
                    </p>
                  </CardContent>
                </Card>

                <div className="flex items-center justify-center gap-4">
                  <Badge variant="success" className="text-lg px-4 py-2">
                    +{feedback.xpAwarded} XP
                  </Badge>
                  {feedback.score >= 80 && (
                    <Badge variant="warning" className="text-lg px-4 py-2">
                      New Badge Unlocked: The Skeptic
                    </Badge>
                  )}
                </div>

                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => setShowOverlay(false)}
                    variant="outline"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setShowOverlay(false);
                      router.push("/dashboard");
                    }}
                  >
                    Return to Dashboard
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
