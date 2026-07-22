const express = require("express");
const path = require("path");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(__dirname));
app.use(express.json());

// OpenAI Client
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Check API Key
console.log("API Key Loaded:", process.env.OPENAI_API_KEY ? "YES" : "NO");

// Homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// AI Recommendation Route
app.post("/recommend", async (req, res) => {
    try {
        const data = req.body;

        const prompt = `
You are an agricultural expert for Kerala farmers.

District: ${data.district}
Soil Type: ${data.soil}
Crop: ${data.crop}
Season: ${data.season}
Temperature: ${data.temperature}
Humidity: ${data.humidity}
Nitrogen: ${data.nitrogen}
Phosphorus: ${data.phosphorus}
Potassium: ${data.potassium}
pH: ${data.ph}

Provide:
1. Crop Recommendation
2. Fertilizer Recommendation
3. Weather Advice
4. Disease Prevention Advice
`;

        const response = await client.responses.create({
            model: "gpt-4o-mini",
            input: prompt
        });

        res.json({
            recommendation: response.output_text
        });

    } catch (error) {
        console.log("\n========== OPENAI ERROR ==========");
        console.log("Status:", error.status);
        console.log("Message:", error.message);
        console.log("==================================\n");

        res.status(500).json({
            recommendation: "AI recommendation could not be generated."
        });
    }
});

// API Test Route
app.get("/test", async (req, res) => {
    try {
        const response = await client.responses.create({
            model: "gpt-4o-mini",
            input: "Say hello in one sentence."
        });

        res.send(response.output_text);

    } catch (error) {
        console.log("\n========== TEST ERROR ==========");
        console.log("Status:", error.status);
        console.log("Message:", error.message);
        console.log("================================\n");

        res.send("OpenAI API test failed.");
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});