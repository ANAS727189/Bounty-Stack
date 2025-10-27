// src/routes/index.ts
import express from 'express';
import userRoutes from './user.routes';
// Import other route files here (e.g., questionRoutes, answerRoutes)

const router = express.Router();

router.use('/users', userRoutes);
// router.use('/questions', questionRoutes);
// router.use('/answers', answerRoutes);

export default router;