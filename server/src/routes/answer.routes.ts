import express from 'express';
import {
  addAnswerToQuestion,
  getAnswersForQuestion,
  markAnswerCorrect,
  markAnswerSpam,
  markAnswerWrong,
  getMyAnswers,
} from '../controllers/answer.controllers';
import { protect } from '../middlewares/auth.middlewares';

const router = express.Router();

router.route('/question/:questionId')
    .get(getAnswersForQuestion);    // GET /api/v1/answers/question/:questionId

router.use(protect);

router.route('/question/:questionId')
    .post(addAnswerToQuestion)      // POST /api/v1/answers/question/:questionId

router.route('/my-answers')
    .get(getMyAnswers);             // GET /api/v1/answers/my-answers

router.route('/:answerId/correct')
    .patch(markAnswerCorrect);      // PATCH /api/v1/answers/:answerId/correct

router.route('/:answerId/spam')
    .patch(markAnswerSpam);         // PATCH /api/v1/answers/:answerId/spam

router.route('/:answerId/wrong')
    .patch(markAnswerWrong);        // PATCH /api/v1/answers/:answerId/wrong

export default router;