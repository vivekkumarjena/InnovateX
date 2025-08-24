import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const signTokenAndSetCookie = (res, user) => {
const payload = { id: user._id, email: user.email };
const token = jwt.sign(payload, process.env.JWT_SECRET, {
expiresIn: process.env.JWT_EXPIRES || '7d',
});


const isProd = process.env.NODE_ENV === 'production';


res.cookie('token', token, {
httpOnly: true,
sameSite: isProd ? 'none' : 'lax',
secure: isProd, // must be true if sameSite=none (HTTPS only)
maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});
};

export const register = async (req, res) => {
try {
const { fullName, email, password } = req.body;
if (!email || !password) return res.status(400).json({ message: 'Email & password required' });


const exists = await User.findOne({ email });
if (exists) return res.status(409).json({ message: 'Email already registered' });


const hash = await bcrypt.hash(password, 10);
const user = await User.create({ fullName, email, password: hash });


signTokenAndSetCookie(res, user);
return res.status(201).json({
user: { id: user._id, email: user.email, fullName: user.fullName },
});
} catch (e) {
console.error(e);
return res.status(500).json({ message: 'Server error' });
}
};

export const login = async (req, res) => {
try {
const { email, password } = req.body;
const user = await User.findOne({ email });
if (!user) return res.status(401).json({ message: 'Invalid credentials' });


const ok = await bcrypt.compare(password, user.password);
if (!ok) return res.status(401).json({ message: 'Invalid credentials' });


signTokenAndSetCookie(res, user);
return res.json({ user: { id: user._id, email: user.email, fullName: user.fullName } });
} catch (e) {
console.error(e);
return res.status(500).json({ message: 'Server error' });
}
};

export const me = async (req, res) => {
try {
const token = req.cookies.token;
if (!token) return res.status(200).json({ user: null });


const decoded = jwt.verify(token, process.env.JWT_SECRET);
const user = await User.findById(decoded.id).select('_id email fullName');
if (!user) return res.status(200).json({ user: null });


return res.json({ user });
} catch (e) {
return res.status(200).json({ user: null });
}
};

export const logout = async (req, res) => {
const isProd = process.env.NODE_ENV === 'production';
res.clearCookie('token', {
httpOnly: true,
sameSite: isProd ? 'none' : 'lax',
secure: isProd,
});
return res.json({ message: 'Logged out' });
};