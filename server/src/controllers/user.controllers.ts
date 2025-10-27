// src/controllers/user.controllers.ts
import { Request, Response, NextFunction } from 'express';
import User from '../models/user.models';
import { sendSuccess } from '../utils/globalResponse';
import { GlobalError } from '../utils/globalError';

// Simple findOrCreate logic for login
export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { walletAddress } = req.body;
    if (!walletAddress) {
      return next(new GlobalError('Wallet address is required', 400));
    }

    let user = await User.findOne({ walletAddress });

    if (!user) {
      user = await User.create({ walletAddress });
    }

    sendSuccess(res, 200, user, user ? 'User logged in' : 'User created');

  } catch (error) {
    next(error); // Pass error to global handler
  }
};

// Example: Get user profile
export const getUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Assuming walletAddress comes from authenticated user or params
        const walletAddress = req.params.walletAddress; // Example: get from URL param
        if (!walletAddress) {
          return next(new GlobalError('Wallet address parameter is required', 400));
        }

        const user = await User.findOne({ walletAddress });
        if (!user) {
            return next(new GlobalError('User not found', 404));
        }
        sendSuccess(res, 200, user);
    } catch (error) {
        next(error);
    }
}