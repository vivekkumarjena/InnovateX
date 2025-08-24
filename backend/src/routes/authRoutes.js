import { Router } from 'express';
import { login, register, me, logout } from '../controllers/authController.js';


const router = Router();
router.post('/register', register);
router.post('/login', login);
router.get('/me', me);
router.post('/logout', logout);


export default router;