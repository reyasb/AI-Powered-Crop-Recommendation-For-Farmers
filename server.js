const express = require("express");
const path = require("path");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "../")));

// OpenAI Client
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../index.html"));
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
        console.error(error);

        res.status(500).json({
            recommendation: "AI recommendation could not be generated."
        });
    }
});

// Test Route
app.get("/test", async (req, res) => {
    try {
        const response = await client.responses.create({
            model: "gpt-4o-mini",
            input: "Say hello in one sentence."
        });

        res.send(response.output_text);

    } catch (error) {
        console.error(error);
        res.status(500).send("OpenAI API test failed.");
    }
});

// Only listen when running locally
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}

// Export app for Vercel
module.exports = app;