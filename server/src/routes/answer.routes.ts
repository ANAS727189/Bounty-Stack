import express from 'express';
import {
  addAnswerToQuestion,
  getAnswersForQuestion,
  markAnswerCorrect,
  markAnswerSpam,
} from '../controllers/answer.controllers';
import { protect } from '../middlewares/auth.middlewares';

const router = express.Router();

router.use(protect);

router.route('/question/:questionId')
    .post(addAnswerToQuestion)      // POST /api/v1/answers/question/:questionId
    .get(getAnswersForQuestion);    // GET /api/v1/answers/question/:questionId


router.route('/:answerId/correct')
    .patch(markAnswerCorrect);      // PATCH /api/v1/answers/:answerId/correct

router.route('/:answerId/spam')
    .patch(markAnswerSpam);         // PATCH /api/v1/answers/:answerId/spam


export default router;