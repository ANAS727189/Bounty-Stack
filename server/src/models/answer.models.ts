import mongoose, { Schema, Document } from 'mongoose';
import { IQuestion } from './question.models';
import { IUser } from './user.models'; 


export interface IAnswer extends Document {
  answerText: string;
  answererWallet: string; // The answerer's Solana wallet address
  answererRef?: IUser['_id']; // Optional reference to User document _id
  questionId: IQuestion['_id']; // Reference to the Question document _id
  status: 'active' | 'selected' | 'spam';
  createdAt: Date;
  updatedAt: Date;
}

const AnswerSchema: Schema = new Schema(
  {
    answerText: {
      type: String,
      required: [true, 'Answer text is required'],
      trim: true,
      minlength: [10, 'Answer must be at least 10 characters'],
      // Adjust maxlength as needed
      maxlength: [5000, 'Answer cannot exceed 5000 characters'],
    },
    answererWallet: {
      type: String,
      required: [true, 'Answerer wallet address is required'],
      index: true,
    },
    answererRef: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    questionId: {
      type: Schema.Types.ObjectId,
      ref: 'Question', // Creates a reference to the Question model
      required: true,
      index: true, // Index for quickly finding answers for a question
    },
    status: {
      type: String,
      enum: ['active', 'selected', 'spam'],
      default: 'active',
      required: true,
      index: true, // Index for filtering answers by status
    },
  },
  {
    timestamps: true,
  }
);


AnswerSchema.pre<IAnswer>('save', async function (next) {
  // Check if question exists before saving answer
  const questionExists = await mongoose.model('Question').findById(this.questionId);
  if (!questionExists) {
    return next(new Error('Cannot post answer to a non-existent question'));
  }
  next();
});

export default mongoose.model<IAnswer>('Answer', AnswerSchema);