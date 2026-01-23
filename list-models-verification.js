const https = require('https');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("No API Key");
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.models) {
                const names = json.models.map(m => m.name).join('\n');
                fs.writeFileSync('models_list.txt', names);
                console.log("Written to models_list.txt");
            } else {
                console.log("ERROR RESPONSE:", data);
            }
        } catch (e) {
            console.error("Parse Error:", e);
        }
    });
}).on('error', (e) => {
    console.error("Request Error:", e);
});
