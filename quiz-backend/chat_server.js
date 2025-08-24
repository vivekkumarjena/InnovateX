import express from "express";
import cors from "cors";
import "dotenv/config";  // load .env
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/chat", async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(req.body.userQuery);
    res.json({ response: result.response.text() });
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ response: "AI error: " + err.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
