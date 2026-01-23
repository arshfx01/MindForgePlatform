const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function test() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("Testing Key:", apiKey ? apiKey.substring(0, 5) + "..." : "MISSING");

    if (!apiKey) return;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        const result = await model.generateContent("Say hello");
        console.log("Success:", result.response.text());
    } catch (e) {
        console.error("Error:", e.message);
    }
}

test();
