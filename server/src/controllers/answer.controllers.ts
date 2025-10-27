import { Request, Response, NextFunction } from 'express';
import Answer, { IAnswer } from '../models/answer.models'; // Corrected import path
import Question from '../models/question.models'; // Corrected import path
import User from '../models/user.models'; // Corrected import path
import { sendSuccess } from '../utils/globalResponse';
import { GlobalError } from '../utils/globalError';
import { asyncController } from '../utils/asyncController'; // Import the async wrapper
import mongoose from 'mongoose'; // Needed for transaction

// --- Add Answer to a Question ---
export const addAnswerToQuestion = asyncController(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const questionId = req.params.questionId; // Get question ID from URL parameter
  const answererWallet = req.walletAddress; 
  if (!answererWallet) {
       return next(new GlobalError('answererWallet wallet not found on request after auth.', 500)); // Should not happen
  }
  const { answerText} = req.body; 

  if (!answerText) {
    return next(new GlobalError('Answer text is required', 400));
  }

  // Find the question
  const question = await Question.findById(questionId);
  if (!question) {
    return next(new GlobalError('Question not found', 404));
  }

  // Check if the question is open for answers
  if (question.status !== 'open') {
    return next(new GlobalError('This question is not currently open for answers', 400));
  }

  // Optional: Verify user exists and check reputation (can be middleware)
  const answerer = await User.findOne({ walletAddress: answererWallet });
  if (!answerer) {
    return next(new GlobalError('Answerer user profile not found', 404));
  }
  if (answerer.reputation <= 0) {
    return next(new GlobalError('User reputation too low to post answers', 403));
  }

  // Create the new answer
  const newAnswer = await Answer.create({
    answerText,
    answererWallet,
    questionId: question._id,
    // answererRef will be set by pre-save hook if enabled
  });

  sendSuccess(res, 201, newAnswer, 'Answer submitted successfully');
});

// --- Get Answers for a specific Question ---
export const getAnswersForQuestion = asyncController(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const questionId = req.params.questionId;

  // Optional Pagination
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20; // More answers per page perhaps
  const skip = (page - 1) * limit;

  // Verify question exists (optional, but good practice)
  const questionExists = await Question.findById(questionId).select('_id'); // Only fetch ID
  if (!questionExists) {
      return next(new GlobalError('Question not found', 404));
  }

  const answers = await Answer.find({ questionId: questionId })
    .sort({ createdAt: 1 }) // Sort by oldest first (chronological order)
    .skip(skip)
    .limit(limit)
    // Optionally populate answerer details: .populate('answererRef', 'username reputation');
    .exec();

  const totalAnswers = await Answer.countDocuments({ questionId: questionId });

   sendSuccess(res, 200, {
      answers,
      currentPage: page,
      totalPages: Math.ceil(totalAnswers / limit),
      totalAnswers,
  });
});

// --- Mark an Answer as Correct (Triggers On-Chain Award - Logic added later) ---
export const markAnswerCorrect = asyncController(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const answerId = req.params.answerId;
  const askerWallet  = req.walletAddress;

  // Use a session for atomicity (ensures both Question and Answer update or neither)
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
      // Should ideally not happen if answer exists, but good check
      throw new GlobalError('Associated question not found', 404);
    }

    // Security check: Only the original asker can mark correct
    if (question.askerWallet !== askerWallet) {
      throw new GlobalError('Only the asker can mark an answer as correct', 403);
    }

    // Check if question is still open (important state check)
    if (question.status !== 'open') {
        throw new GlobalError('Question is not open or already resolved', 400);
    }

    // Update states
    answer.status = 'selected';
    question.status = 'awarded';

    await answer.save({ session });
    await question.save({ session });

    // --- TODO: Trigger the on-chain award_bounty instruction HERE ---
    // This backend endpoint should now tell the frontend to initiate the
    // award_bounty transaction with question.question_id and answer.answererWallet.
    // The frontend handles the signing. The backend just authorizes it.
    // We could return a signed message or specific token for the frontend to use.
    // For now, just confirm the DB update.

    await session.commitTransaction();
    session.endSession();

    sendSuccess(res, 200, { answer, question }, 'Answer marked as correct. Database updated.');

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error); // Pass error to global handler
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
    // Allow marking spam even if selected? Or only if active? Let's say only active for now.
    if (answer.status !== 'active') {
       throw new GlobalError('Only active answers can be marked as spam', 400);
    }

    const question = await Question.findById(answer.questionId).select('askerWallet').session(session);
    if (!question) {
      throw new GlobalError('Associated question not found', 404);
    }

    // Security check: Only the original asker can mark spam
    if (question.askerWallet !== askerWallet) {
      throw new GlobalError('Only the asker can mark an answer as spam', 403);
    }

    // Update answer status
    answer.status = 'spam';
    await answer.save({ session });

    // Decrease answerer's reputation
    const answerer = await User.findOne({ walletAddress: answer.answererWallet }).session(session);
    if (answerer) {
      // Ensure reputation doesn't go below 0
      answerer.reputation = Math.max(0, answerer.reputation - 50);
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