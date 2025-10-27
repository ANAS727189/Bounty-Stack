import express from 'express';
import {
  createQuestion,
  getAllOpenQuestions,
  getQuestionById,
  fundQuestion,
} from '../controllers/question.controllers';
import { protect } from '../middlewares/auth.middlewares';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createQuestion)     // POST /api/v1/questions
  .get(getAllOpenQuestions); // GET /api/v1/questions

router.route('/:id')
  .get(getQuestionById);     // GET /api/v1/questions/:id

router.route('/:id/fund')
  .patch(fundQuestion);       // PATCH /api/v1/questions/:id/fund

export default router;