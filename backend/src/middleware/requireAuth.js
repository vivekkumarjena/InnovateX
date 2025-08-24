import jwt from 'jsonwebtoken';


export default function requireAuth(req, res, next) {
try {
const token = req.cookies.token;
if (!token) return res.status(401).json({ message: 'Unauthorized' });


const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = decoded; // { id, email }
next();
} catch (e) {
return res.status(401).json({ message: 'Unauthorized' });
}
}