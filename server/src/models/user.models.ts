// src/models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

// Interface for type safety
export interface IUser extends Document {
  walletAddress: string;
  reputation: number;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  walletAddress: {
    type: String,
    required: [true, 'Wallet address is required'],
    unique: true,
    trim: true,
  },
  reputation: {
    type: Number,
    default: 100,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IUser>('User', UserSchema);