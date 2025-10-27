import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.models';

export interface IQuestion extends Document {
  title: string;
  descriptionLink?: string; // Optional: Link to GitHub Gist, etc.
  askerWallet: string; // The asker's Solana wallet address
  askerRef?: IUser['_id']; // Optional reference to User document _id
  bountyPda?: string; // Solana address of the on-chain bounty escrow PDA
  bountyAmountLamports?: number; // Store off-chain for easy display
  status: 'pending_funding' | 'open' | 'awarded' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Question title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    descriptionLink: {
      type: String,
      trim: true,
      // Optional: Add validation for URL format if desired
    },
    askerWallet: {
      type: String,
      required: [true, 'Asker wallet address is required'],
      // Add index for faster lookups based on asker
      index: true,
    },
    askerRef: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    bountyPda: {
      type: String,
      // Unique because one question should only have one bounty PDA
      unique: true,
      // Sparse index allows multiple documents without this field (before funding)
      sparse: true,
      index: true,
    },
    bountyAmountLamports: {
        type: Number, // Store as lamports (u64 can exceed JS Number limit, but Mongoose handles large numbers)
        min: 0,
    },
    status: {
      type: String,
      enum: ['pending_funding', 'open', 'awarded', 'cancelled'],
      default: 'pending_funding',
      required: true,
      index: true, // Index for filtering questions by status
    },
  },
  {
    timestamps: true,
  }
);

// Optional: Pre-save hook to link askerRef based on askerWallet
QuestionSchema.pre<IQuestion>('save', async function (next) {
  if (this.isNew || this.isModified('askerWallet')) {
    const user = await mongoose.model('User').findOne({ walletAddress: this.askerWallet });
    if (user) {
      this.askerRef = user._id;
    }
  }
  next();
});

export default mongoose.model<IQuestion>('Question', QuestionSchema);