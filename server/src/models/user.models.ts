import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  walletAddress: string;
  reputation: number;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    maxlength: [30, 'Username cannot exceed 30 characters'],
  },
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