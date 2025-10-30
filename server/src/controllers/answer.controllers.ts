import { Request, Response, NextFunction } from 'express';
import Answer, { IAnswer } from '../models/answer.models';
import Question from '../models/question.models';
import User from '../models/user.models';
import { sendSuccess } from '../utils/globalResponse';
import { GlobalError } from '../utils/globalError';
import { asyncController } from '../utils/asyncController';
import mongoose from 'mongoose';

// --- Add Answer to a Question ---
export const addAnswerToQuestion = asyncController(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const questionId = req.params.questionId;
  const answererWallet = req.walletAddress;

  if (!answererWallet) {
    return next(new GlobalError('answererWallet wallet not found on request after auth.', 500));
  }

  const { answerText } = req.body;

  if (!answerText) {
    return next(new GlobalError('Answer text is required', 400));
  }

  const question = await Question.findById(questionId);
  if (!question) {
    return next(new GlobalError('Question not found', 404));
  }

  if (question.status !== 'open') {
    return next(new GlobalError('This question is not currently open for answers', 400));
  }

  const answerer = await User.findOne({ walletAddress: answererWallet });
  if (!answerer) {
    return next(new GlobalError('Answerer user profile not found', 404));
  }
  if (answerer.reputation <= 0) {
    return next(new GlobalError('User reputation too low to post answers', 403));
  }

  const newAnswer = await Answer.create({
    answerText,
    answererWallet,
    questionId: question._id,
  });

  sendSuccess(res, 201, newAnswer, 'Answer submitted successfully');
});

// --- Get Answers for a specific Question ---
export const getAnswersForQuestion = asyncController(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const questionId = req.params.questionId;

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  const questionExists = await Question.findById(questionId).select('_id');
  if (!questionExists) {
    return next(new GlobalError('Question not found', 404));
  }

  const answers = await Answer.find({ questionId: questionId })
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit)
    .exec();

  const totalAnswers = await Answer.countDocuments({ questionId: questionId });

  sendSuccess(res, 200, {
    answers,
    currentPage: page,
    totalPages: Math.ceil(totalAnswers / limit),
    totalAnswers,
  });
});

// --- Get All Answers by the Logged-in User ---
export const getMyAnswers = asyncController(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const answererWallet = req.walletAddress;

  if (!answererWallet) {
    return next(new GlobalError('Wallet not found on request after auth.', 500));
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  const answers = await Answer.find({ answererWallet: answererWallet })
    .sort({ createdAt: -1 }) // Show most recent first
    .skip(skip)
    .limit(limit)
    .exec();
    
  const totalAnswers = await Answer.countDocuments({ answererWallet: answererWallet });

  sendSuccess(res, 200, {
    answers,
    currentPage: page,
    totalPages: Math.ceil(totalAnswers / limit),
    totalAnswers,
  });
});

// --- Mark an Answer as Correct (Triggers On-Chain Award) ---
export const markAnswerCorrect = asyncController(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const answerId = req.params.answerId;
  const askerWallet = req.walletAddress;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const answer = await Answer.findById(answerId).session(session);
    if (!answer) {
      throw new GlobalError('Answer not found', 404);
    }
    if (answer.status !== 'active') {
      throw new GlobalError('Answer is not active', 400);
    }

    const question = await Question.findById(answer.questionId).session(session);
    if (!question) {
      throw new GlobalError('Associated question not found', 404);
    }

    if (question.askerWallet !== askerWallet) {
      throw new GlobalError('Only the asker can mark an answer as correct', 403);
    }

    if (question.status !== 'open') {
      throw new GlobalError('Question is not open or already resolved', 400);
    }

    // Update states
    answer.status = 'selected';
    question.status = 'awarded';

    // ✅ REWARD THE ANSWERER
    const answerer = await User.findOne({ walletAddress: answer.answererWallet }).session(session);
    if (answerer) {
      answerer.reputation += 100; // Reward for correct answer
      await answerer.save({ session });
    }

    await answer.save({ session });
    await question.save({ session });

    await session.commitTransaction();
    session.endSession();

    sendSuccess(res, 200, { answer, question, answerer }, 'Answer marked as correct. Database updated. Proceed with blockchain award.');

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
});

// --- Mark an Answer as Spam ---
export const markAnswerSpam = asyncController(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const answerId = req.params.answerId;
  const askerWallet = req.walletAddress;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const answer = await Answer.findById(answerId).session(session);
    if (!answer) {
      throw new GlobalError('Answer not found', 404);
    }
    if (answer.status !== 'active') {
      throw new GlobalError('Only active answers can be marked as spam', 400);
    }

    const question = await Question.findById(answer.questionId).select('askerWallet').session(session);
    if (!question) {
      throw new GlobalError('Associated question not found', 404);
    }

    if (question.askerWallet !== askerWallet) {
      throw new GlobalError('Only the asker can mark an answer as spam', 403);
    }

    answer.status = 'spam';
    await answer.save({ session });

    const answerer = await User.findOne({ walletAddress: answer.answererWallet }).session(session);
    if (answerer) {
      answerer.reputation = Math.max(0, answerer.reputation - 50);
      
      if (answerer.reputation === 0) {
        console.warn(`⚠️ User ${answer.answererWallet} reputation hit 0. Consider review.`);
      }
      
      await answerer.save({ session });
    } else {
      console.warn(`Could not find user ${answer.answererWallet} to decrease reputation.`);
    }

    await session.commitTransaction();
    session.endSession();

    sendSuccess(res, 200, { answer, answerer }, 'Answer marked as spam. User reputation updated.');

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
});

// --- ✅ NEW: Mark an Answer as Wrong (No Penalty) ---
export const markAnswerWrong = asyncController(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const answerId = req.params.answerId;
  const askerWallet = req.walletAddress;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const answer = await Answer.findById(answerId).session(session);
    if (!answer) {
      throw new GlobalError('Answer not found', 404);
    }
    
    if (answer.status !== 'active') {
      throw new GlobalError('Only active answers can be marked as wrong', 400);
    }

    const question = await Question.findById(answer.questionId).select('askerWallet status').session(session);
    if (!question) {
      throw new GlobalError('Associated question not found', 404);
    }

    if (question.askerWallet !== askerWallet) {
      throw new GlobalError('Only the asker can mark an answer as wrong', 403);
    }

    if (question.status !== 'open') {
      throw new GlobalError('Cannot mark answers as wrong on a closed question', 400);
    }

    // Update answer status - NO reputation penalty (honest attempt)
    answer.status = 'wrong';
    await answer.save({ session });

    await session.commitTransaction();
    session.endSession();

    sendSuccess(res, 200, { answer }, 'Answer marked as wrong (incorrect but not spam). No reputation penalty applied.');

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
});