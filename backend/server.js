import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './src/routes/authRoutes.js';


dotenv.config();


const app = express();


// --- middleware
app.use(express.json());
app.use(cookieParser());
app.use(
cors({
origin: process.env.FRONTEND_URL,
credentials: true,
})
);


// --- routes
app.use('/api/auth', authRoutes);


// --- db + server
const PORT = process.env.PORT || 5000;
mongoose
.connect(process.env.MONGO_URI)
.then(() => {
console.log('✅ MongoDB connected');
app.listen(PORT, () => console.log(`🚀 Server http://localhost:${PORT}`));
})
.catch((err) => console.error('Mongo error:', err.message));