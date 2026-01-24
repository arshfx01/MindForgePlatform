"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

const geminiApiKey = process.env.GEMINI_API_KEY;
const groqApiKey = process.env.GROQ_API_KEY;

if (!geminiApiKey) {
    console.error("[Oracle] GEMINI_API_KEY is not set.");
}
if (!groqApiKey) {
    console.warn("[Oracle] GROQ_API_KEY is not set. Falling back to Gemini only.");
}

const genAI = new GoogleGenerativeAI(geminiApiKey || "INVALID");
const groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null;

// Groq Priority List
const GROQ_MODELS = [
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
    "mixtral-8x7b-32768"
];

// Gemini Priority List
const GEMINI_MODELS = [
    "gemini-1.5-flash",
    "gemini-2.0-flash-exp",
    "gemini-1.5-pro",
];


async function generateContentWithRetry(prompt: string, retries = 2, delay = 1000) {
    // Attempt Groq First
    if (groq) {
        for (const modelName of GROQ_MODELS) {
            try {
                console.log(`[Oracle] Attempting Groq: ${modelName}`);
                const completion = await groq.chat.completions.create({
                    messages: [{ role: "user", content: prompt }],
                    model: modelName,
                });
                const content = completion.choices[0]?.message?.content;
                if (content) {
                    return { text: () => content };
                }
            } catch (error: any) {
                console.warn(`[Oracle] Groq model ${modelName} failed: ${error.message}`);
                if (error.status === 429) {
                    console.warn(`[Oracle] Groq rate limit hit. Waiting...`);
                    await new Promise(res => setTimeout(res, delay));
                }
            }
        }
    }

    // Fallback to Gemini
    if (!geminiApiKey || geminiApiKey === "INVALID") {
        throw new Error("All AI providers failed. No valid API key found.");
    }

    for (const modelName of GEMINI_MODELS) {
        try {
            const currentModel = genAI.getGenerativeModel({ model: modelName });
            console.log(`[Oracle] Fallback to Gemini: ${modelName}`);

            for (let i = 0; i < retries; i++) {
                try {
                    const result = await currentModel.generateContent(prompt);
                    return { text: () => result.response.text() };
                } catch (error: any) {
                    console.error(`[Oracle] Gemini attempt ${i + 1} failed: ${error.message}`);
                    if (i < retries - 1) await new Promise(res => setTimeout(res, delay));
                }
            }
        } catch (initError: any) {
            console.error(`[Oracle] Failed to initialize Gemini model ${modelName}:`, initError.message);
        }
    }

    throw new Error("All AI models (Groq & Gemini) failed.");
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
      You are the "Oracle" of MindForge. Generate 10 progressive critical thinking scenarios for a new user.
      
      RULES:
      1. Language: Use simple, everyday language. No academic jargon.
      2. Relatability: Scenarios should be about common life situations (work, friends, money, social media).
      3. Length: Keep scenarios short (1-2 sentences).
      
      The scenarios must cover different thinking styles: logic, bias, ethics, and information.
      
      Format: JSON ARRAY ONLY. NO MARKDOWN.
      Each object: {"id": number, "scenario": "...", "options": ["Option A (Logical)", "Option B (Balanced)", "Option C (Emotional)"]}
    `;


    try {
        const result = await generateContentWithRetry(prompt);
        const text = result.text().replace(/```json/g, "").replace(/```/g, "").trim();
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
        const text = result.text().replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(text);
    } catch (e) {
        return { level: 1, stats: { logic: 20, flexibility: 20, ethics: 20 } };
    }
}

export async function generateScenario(userLevel: number, stats?: { logic: number; flexibility: number; ethics: number }, lastScore?: number): Promise<string> {
    let focusArea = "General Critical Thinking";
    if (stats) {
        const lowest = Object.entries(stats).reduce((a, b) => a[1] < b[1] ? a : b);
        focusArea = `Focus on improving: ${lowest[0].toUpperCase()}`;
    }

    // Adaptive Difficulty Logic
    let difficultyTitle = "Medium";
    let difficultyInstruction = "Provide a scenario that requires careful thought but is manageable.";

    if (lastScore !== undefined) {
        if (lastScore >= 80) {
            difficultyTitle = "Challenging (Hard)";
            difficultyInstruction = "The user easily solved the last one. Make this one COMPLEX. It should require deep thinking, involve multiple layers of contradiction, or subtle logical traps.";
        } else if (lastScore <= 40) {
            difficultyTitle = "Introductory (Easy)";
            difficultyInstruction = "The user struggled previously. Make this one SIMPLE and very clear. Focus on a single, relatable dilemma.";
        }
    }

    const prompt = `
      Generate a ${difficultyTitle} Critical Thinking Arena Scenario.
      Target User Focus: ${focusArea}
      
      RULES for the Scenario:
      1. Language: Simple, relatable, no complex jargon.
      2. Relatability: Use real-world, everyday situations (e.g., workplace drama, social media, friendship, family, simple business).
      3. Size: Shorter than usual. Max 3-4 sentences total.
      4. Difficulty: ${difficultyInstruction}
      
      Structure in Markdown:
      # [Simple Title]
      **Situation**: [Relatable context]
      **The Dilemma**: [Clear problem to solve]
      **The Task**: [Specific ask for the user]
    `;

    try {
        const result = await generateContentWithRetry(prompt);
        return result.text();
    } catch (error) {
        console.error("Scenario Gen Error:", error);
        return "# Baseline Test\n**Situation**: The system is recalibrating.\n**The Dilemma**: You must remain sharp without an active trial.\n**The Task**: How do you maintain critical thinking skills daily?";
    }
}


export async function evaluateSubmission(scenario: string, userResponse: string): Promise<EvaluationResult> {
    const errorResult = {
        score: 0, xp_awarded: 0, summary: "Evaluation offline.", fallacies: [], strengths: [], growth_tip: "Check logs.",
        new_stats: { logic: 0, flexibility: 0, ethics: 0 }
    };

    const prompt = `
      Evaluate this critical thinking response.
      Scenario: ${scenario}
      User Response: ${userResponse}
      
      BE FAIR BUT HONEST. Use relatable examples in your critique.
      
      Return JSON ONLY:
      {
        "score": 0-100,
        "xp_awarded": 0-200,
        "summary": "Clear and simple direct feedback",
        "fallacies": ["List of any thinking errors in simple terms"],
        "strengths": ["What they did well"],
        "growth_tip": "One simple advice to do better",
        "new_stats": {"logic": 0-5, "flexibility": 0-5, "ethics": 0-5}
      }
    `;


    try {
        const result = await generateContentWithRetry(prompt);
        const text = result.text().replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(text);
    } catch (e) {
        return errorResult;
    }
}

