import express from 'express';
import {
  createQuestion,
  getAllOpenQuestions,
  getQuestionById,
  fundQuestion,
  cancelBounty,
} from '../controllers/question.controllers';
import { protect } from '../middlewares/auth.middlewares';

const router = express.Router();

router.route('/')
  .get(getAllOpenQuestions); // GET /api/v1/questions

router.route('/:id')
  .get(getQuestionById);     // GET /api/v1/questions/:id

router.use(protect);

router.route('/')
  .post(createQuestion)     // POST /api/v1/questions

router.route('/:id/fund')
  .patch(fundQuestion);       // PATCH /api/v1/questions/:id/fund

router.route('/:id/cancel')
  .patch(cancelBounty);       // PATCH /api/v1/questions/:id/cancel

export default router;