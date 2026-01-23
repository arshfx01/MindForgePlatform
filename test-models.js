
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env.local" });

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API key found");
        return;
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent("Hi");
        console.log("SUCCESS with gemini-2.0-flash:", result.response.text());
    } catch (e) {
        console.error("FAIL with gemini-2.0-flash:", e.message);
    }
}

listModels();
