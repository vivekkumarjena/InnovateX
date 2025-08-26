import express from "express";
import cors from "cors";
import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(express.json());

// --- CORS: allow your frontend + localhost (for dev)
const allowedOrigins = [
  process.env.FRONTEND_URL,        // e.g. https://your-frontend.onrender.com
  "http://localhost:5173",
  "http://127.0.0.1:5173"
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
  if (!origin) return cb(null, true); // allow non-browser clients
  if (allowedOrigins.includes(origin)) return cb(null, true);
  console.error("❌ CORS blocked origin:", origin); // log the actual origin
  cb(new Error("Not allowed by CORS"));
}

  })
);

// --- Gemini (chat) route
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/chat", async (req, res) => {
  try {
    const prompt = String(req.body?.userQuery || "");
    if (!prompt.trim()) return res.status(400).json({ response: "Empty prompt." });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    return res.json({ response: result.response.text() });
  } catch (err) {
    console.error("Gemini API error:", err);
    return res.status(500).json({ response: "AI error: " + (err?.message || "Unknown") });
  }
});

// --- Quiz route
const questions = [
  { id: 1, question: "Which famous dance form originated in Odisha and is known for its graceful movements?", options: ["Kathak", "Bharatanatyam", "Odissi", "Kuchipudi"], answer: "Odissi" },
  { id: 2, question: "What is the famous sweet dish of Odisha, especially known from Pahala near Bhubaneswar?", options: ["Sandesh", "Chhena Poda", "Mysore Pak", "Rasmalai"], answer: "Chhena Poda" },
  { id: 3, question: "Which ancient temple in Odisha is dedicated to Lord Jagannath and hosts the famous Rath Yatra?", options: ["Konark Sun Temple", "Lingaraj Temple", "Jagannath Temple", "Mukteshwar Temple"], answer: "Jagannath Temple" },
  { id: 4, question: "Which UNESCO World Heritage Site in Odisha is famous for its intricate carvings and chariot-like structure?", options: ["Sun Temple, Konark", "Jagannath Temple, Puri", "Udayagiri Caves", "Hirakud Dam"], answer: "Sun Temple, Konark" },
  { id: 5, question: "What is the name of Odisha’s traditional handwoven fabric, famous for its intricate tie-dye patterns?", options: ["Chikankari", "Pashmina", "Sambalpuri Ikat", "Banarasi"], answer: "Sambalpuri Ikat" },
  { id: 6, question: "Chilika Lake in Odisha is famous for which unique natural phenomenon?", options: ["Largest coral reef in India", "Migratory birds from Siberia", "Floating markets", "Underground caves"], answer: "Migratory birds from Siberia" },
  { id: 7, question: "Who was the first Chief Minister of Odisha after it became a separate province in 1936?", options: ["Biju Patnaik", "Nabakrushna Choudhuri", "Harekrushna Mahatab", "Nilamani Routray"], answer: "Harekrushna Mahatab" },
  { id: 8, question: "The famous Bali Yatra festival in Odisha celebrates which historical event?", options: ["The victory of Kalinga in the Mahabharata", "The maritime trade between Odisha and Southeast Asia", "The coronation of Odisha’s first king", "The construction of Jagannath Temple"], answer: "The maritime trade between Odisha and Southeast Asia" },
  { id: 9, question: "The Hirakud Dam, one of the longest dams in the world, is built on which river?", options: ["Mahanadi", "Brahmani", "Baitarani", "Subarnarekha"], answer: "Mahanadi" },
  { id: 10, question: "What is the famous tribal festival of Odisha, celebrated with dance and music by the local tribes?", options: ["Nuakhai", "Raja Parba", "Chhau Festival", "Dhanuyatra"], answer: "Nuakhai" }
];

app.get("/api/quiz/questions", (req, res) => res.json(questions));

// --- Start
const PORT = process.env.PORT || 5001; // Render will inject PORT
app.listen(PORT, () => console.log(`✅ Quiz+Chat backend listening on ${PORT}`));
