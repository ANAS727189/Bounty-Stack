import { Request, Response, NextFunction } from 'express';
import Question, { IQuestion } from '../models/question.models';
import User from '../models/user.models';
import { sendSuccess } from '../utils/globalResponse';
import { GlobalError } from '../utils/globalError';
import { asyncController } from '../utils/asyncController';

// --- Create a new Question (Status: pending_funding) ---
export const createQuestion = asyncController(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const askerWallet = req.walletAddress;
  if (!askerWallet) {
    return next(new GlobalError('Asker wallet not found on request after auth.', 500));
  }
  const { title, descriptionLink } = req.body;

  if (!title) {
    return next(new GlobalError('Title is required', 400));
  }

  const askerExists = await User.findOne({ walletAddress: askerWallet });
  if (!askerExists) {
    return next(new GlobalError('Asker user profile not found', 404));
  }

  const newQuestion = await Question.create({
    title,
    descriptionLink,
    askerWallet,
    status: 'pending_funding',
  });

  sendSuccess(res, 201, newQuestion, 'Question created, pending funding');
});

// --- Get All Open Questions (with basic pagination) ---
export const getAllOpenQuestions = asyncController(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const questions = await Question.find({ status: 'open' })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .exec();

  const totalQuestions = await Question.countDocuments({ status: 'open' });

  sendSuccess(res, 200, {
    questions,
    currentPage: page,
    totalPages: Math.ceil(totalQuestions / limit),
    totalQuestions,
  });
});

// --- Get Question By ID ---
export const getQuestionById = asyncController(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const questionId = req.params.id;
  const question = await Question.findById(questionId);

  if (!question) {
    return next(new GlobalError('Question not found', 404));
  }

  sendSuccess(res, 200, question);
});

// --- Update Question after Funding (Called by Frontend after Solana TX) ---
export const fundQuestion = asyncController(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const questionId = req.params.id;
  const askerWallet = req.walletAddress;
  if (!askerWallet) {
    return next(new GlobalError('Asker wallet not found on request after auth.', 500));
  }
  const { bountyPda, bountyAmountLamports } = req.body;

  if (!bountyPda || bountyAmountLamports === undefined) {
    return next(new GlobalError('bountyPda and bountyAmountLamports are required', 400));
  }

  const question = await Question.findById(questionId);

  if (!question) {
    return next(new GlobalError('Question not found', 404));
  }

  if (question.askerWallet !== askerWallet) {
    return next(new GlobalError('Only the asker can fund this question', 403));
  }

  if (question.status !== 'pending_funding') {
    return next(new GlobalError('Question is not pending funding', 400));
  }

  question.bountyPda = bountyPda;
  question.bountyAmountLamports = bountyAmountLamports;
  question.status = 'open';
  await question.save();

  sendSuccess(res, 200, question, 'Question successfully funded and opened');
});

// --- ✅ NEW: Cancel Bounty (Backend Update after Blockchain Refund) ---
export const cancelBounty = asyncController(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const questionId = req.params.id;
  const askerWallet = req.walletAddress;

  if (!askerWallet) {
    return next(new GlobalError('Asker wallet not found on request after auth.', 500));
  }

  const question = await Question.findById(questionId);

  if (!question) {
    return next(new GlobalError('Question not found', 404));
  }

  // Security check: Only the original asker can cancel
  if (question.askerWallet !== askerWallet) {
    return next(new GlobalError('Only the asker can cancel this question', 403));
  }

  // Can only cancel if still open
  if (question.status !== 'open') {
    return next(new GlobalError('Question is not open (already awarded or cancelled)', 400));
  }

  // Update status to cancelled
  question.status = 'cancelled';
  await question.save();

  sendSuccess(res, 200, question, 'Question cancelled successfully. Ensure blockchain refund is also completed.');
});