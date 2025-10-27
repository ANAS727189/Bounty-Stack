// src/routes/user.routes.ts
import express from 'express';
import { loginUser, getUserProfile } from '../controllers/user.controllers';

const router = express.Router();

router.post('/login', loginUser);
router.get('/profile/:walletAddress', getUserProfile); // Example route

export default router;