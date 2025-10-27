import express from 'express';
import userRoutes from './user.routes';
import questionRoutes from './question.routes';
import answerRoutes from './answer.routes';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/questions', questionRoutes);
router.use('/answers', answerRoutes);

export default router;