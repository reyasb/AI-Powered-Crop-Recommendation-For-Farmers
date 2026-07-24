const express = require("express");
const path = require("path");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../")));

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: true
    }
});

// REGISTER
app.post("/api/register", async (req, res) => {
    try {

        const { name, email, password } = req.body;

        const [user] = await pool.query(
            "SELECT * FROM users WHERE email=?",
            [email]
        );

        if (user.length > 0) {
            return res.json({
                success: false,
                message: "Email already exists"
            });
        }

        const hash = await bcrypt.hash(password, 10);

        await pool.query(
            "INSERT INTO users(full_name,email,password) VALUES(?,?,?)",
            [name, email, hash]
        );

        res.json({
            success: true
        });

    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            message: "Registration failed"
        });
    }
});

// LOGIN
app.post("/api/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const [rows] = await pool.query(
            "SELECT * FROM users WHERE email=?",
            [email]
        );

        if (rows.length == 0) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        const valid = await bcrypt.compare(
            password,
            rows[0].password
        );

        if (!valid) {
            return res.json({
                success: false,
                message: "Wrong password"
            });
        }

        res.json({
            success: true
        });

    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            message: "Login failed"
        });
    }

});

// AI Route
app.post("/recommend", async (req, res) => {

    try {

        const response = await client.responses.create({
            model: "gpt-4o-mini",
            input: "Recommend a crop"
        });

        res.json({
            recommendation: response.output_text
        });

    } catch {

        res.json({
            recommendation: "AI Error"
        });

    }

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server Running on Port " + PORT);
});