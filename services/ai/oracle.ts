"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("CRITICAL: GEMINI_API_KEY is not set.");
}

const genAI = new GoogleGenerativeAI(apiKey || "INVALID");

// Priority List: Standard 2.0 Flash -> Lite -> 1.5 Fallback
const MODEL_PRIORITY = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite-preview-02-05",
    "gemini-flash-latest"
];

async function generateContentWithRetry(prompt: string, retries = 2, delay = 2000) {
    for (const modelName of MODEL_PRIORITY) {
        const currentModel = genAI.getGenerativeModel({ model: modelName });
        console.log(`[Oracle] Attempting generation with model: ${modelName}`);

        for (let i = 0; i < retries; i++) {
            try {
                return await currentModel.generateContent(prompt);
            } catch (error: any) {
                const isRateLimit = error.status === 429 || error.message?.includes('429');
                const isNotFound = error.status === 404 || error.message?.includes('404');

                if (isNotFound) {
                    console.warn(`[Oracle] Model ${modelName} not found (404). Skipping to next model...`);
                    break; // Break retry loop, move to next model
                }

                if (isRateLimit && i < retries - 1) {
                    console.warn(`[Oracle] Rate limited on ${modelName}. Retrying in ${delay / 1000}s...`);
                    await new Promise(res => setTimeout(res, delay));
                    delay *= 2;
                    continue;
                }

                // If it's the last retry for this model, fallback
                if (i === retries - 1) {
                    console.error(`[Oracle] Model ${modelName} failed after retries.`);
                }
            }
        }
    }
    throw new Error("All AI models failed or rate limited.");
}

export interface OnboardingQuestion {
    id: number;
    scenario: string;
    options: string[];
}

export interface EvaluationResult {
    score: number;
    xp_awarded: number;
    summary: string;
    fallacies: string[];
    strengths: string[];
    growth_tip: string;
    new_stats: {
        logic: number;
        flexibility: number;
        ethics: number;
    }
}

const FALLBACK_QUESTIONS: OnboardingQuestion[] = [
    { id: 1, scenario: "You find a wallet with $500. Rent is due tomorrow and you are short exactly that amount.", options: ["Return it immediately", "Keep it for rent", "Return the wallet but keep the cash"] },
    { id: 2, scenario: "A colleague takes credit for your brilliant idea in a company-wide meeting.", options: ["Confront them in the meeting", "Speak to them privately later", "Report it to your manager"] },
    { id: 3, scenario: "You read a viral social media post that perfectly aligns with your beliefs but has no sources.", options: ["Share it immediately", "Search for a primary source", "Ignore it"] },
    { id: 4, scenario: "An old friend asks for honest feedback on their new startup idea, which you think is terrible.", options: ["Tell them it's great to be supportive", "Explain exactly why it will fail", "Highlight risks and suggest pivots"] },
    { id: 5, scenario: "A cashier gives you $20 extra in change by mistake.", options: ["Return it immediately", "Keep it as a 'bonus'", "Donate it to a nearby charity box"] },
    { id: 6, scenario: "You have two deadlines: one for your strict boss, and one for a colleague who helped you last week.", options: ["Work on the boss's task first", "Help the colleague first", "Try to negotiate both deadlines"] },
    { id: 7, scenario: "Someone insults your intelligence in a professional online forum.", options: ["Ignore and stay professional", "Draft a witty, sharp response", "Report the comment for harassment"] },
    { id: 8, scenario: "You witness a minor hit-and-run in a parking lot. No one else saw it.", options: ["Record the plate and leave a note", "Minding your own business", "Call the police immediately"] },
    { id: 9, scenario: "Your company implements a new tool that is clearly less efficient than the old one.", options: ["Use it without complaining", "Identify specific flaws and propose fixes", "Continue using the old tool in secret"] },
    { id: 10, scenario: "A trolley is speeding toward 5 workers. You can flip a switch to kill 1 worker instead.", options: ["Flip the switch", "Do nothing", "Try to stop the trolley manually"] }
];

export async function generateOnboardingQuestions(): Promise<OnboardingQuestion[]> {
    const prompt = `
      You are the "Oracle" of MindForge. Generate 10 progressive critical thinking scenarios to assess a newcomer's baseline.
      The scenarios must cover:
      1. Deductive Logic
      2. Cognitive Bias Identification
      3. Ethical Utilitarianism
      4. Dialectical Reasoning
      5. Informational Literacy
      
      Format: JSON ARRAY ONLY. NO MARKDOWN.
      Each object: {"id": number, "scenario": "...", "options": ["Option A (Logical)", "Option B (Fallback)", "Option C (Emotional)"]}
      
      Make them intellectually stimulating but accessible.
    `;

    try {
        const result = await generateContentWithRetry(prompt);
        const response = result.response;
        const text = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        return FALLBACK_QUESTIONS;
    } catch (error) {
        console.error("AI Generation Error:", error);
        return FALLBACK_QUESTIONS;
    }
}

export async function evaluateOnboarding(answers: { questionId: number, answerIndex: number }[]): Promise<{ level: number, stats: { logic: number, flexibility: number, ethics: number } }> {
    const prompt = `
      Analyst Assessment Protocol.
      User Answers (index 0=A, 1=B, 2=C): ${JSON.stringify(answers)}
      
      Evaluate their cognitive profile based on these 10 answers.
      - Level 1: Novice (Basic intuition)
      - Level 2: Apprentice (Consistent patterns)
      - Level 3: Analyst (Systematic approach)
      - Level 4: Strategist (Nuanced complexity)
      - Level 5: Master (Superior dialectics)
      
      Return JSON ONLY: {"level": number, "stats": {"logic": 10-100, "flexibility": 10-100, "ethics": 10-100}}
    `;

    try {
        const result = await generateContentWithRetry(prompt);
        const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(text);
    } catch (e) {
        return { level: 1, stats: { logic: 20, flexibility: 20, ethics: 20 } };
    }
}

export async function generateScenario(userLevel: number, stats?: { logic: number; flexibility: number; ethics: number }): Promise<string> {
    let focusArea = "General Critical Thinking";
    if (stats) {
        // Identify lowest stat to focus on
        const lowest = Object.entries(stats).reduce((a, b) => a[1] < b[1] ? a : b);
        focusArea = `Improving Weakness: ${lowest[0].toUpperCase()} (Current Score: ${lowest[1]})`;
    }

    const prompt = `
      Generate a Level ${userLevel} Critical Thinking Arena Scenario.
      Target User Focus: ${focusArea}
      Subject: High-stakes ethical or logical crisis (e.g., AI alignment, resource scarcity, legal paradox).
      
      Structure in Markdown:
      # [Provocative Title]
      **Situation**: [2-3 sentences of context]
      **The Dilemma**: [The core problem requiring deep thought]
      **The Task**: [Specifically what the user must argue or solve]
      
      Make it feel "Cyberpunk/Deep Space" in tone.
    `;
    try {
        const result = await generateContentWithRetry(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Scenario Gen Error:", error);
        return "# Offline Mode\nSystem couldn't reach the Oracle.";
    }
}

export async function evaluateSubmission(scenario: string, userResponse: string): Promise<EvaluationResult> {
    const errorResult = {
        score: 0, xp_awarded: 0, summary: "Evaluation offline.", fallacies: [], strengths: [], growth_tip: "Check logs.",
        new_stats: { logic: 0, flexibility: 0, ethics: 0 }
    };

    const prompt = `
      Act as the High Oracle of Logic. Evaluate this Arena submission.
      Scenario: ${scenario}
      User Response: ${userResponse}
      
      Critique strictly but fairly. Identify logical fallacies and cognitive strengths.
      
      Return JSON ONLY:
      {
        "score": 0-100,
        "xp_awarded": 0-200,
        "summary": "Short, punchy critique",
        "fallacies": ["List specific fallacies if any"],
        "strengths": ["List specific strengths"],
        "growth_tip": "One actionable tip to improve thinking",
        "new_stats": {"logic": 0-5, "flexibility": 0-5, "ethics": 0-5}
      }
    `;

    try {
        const result = await generateContentWithRetry(prompt);
        const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(text);
    } catch (e) {
        return errorResult;
    }
}

