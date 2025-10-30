import { Request, Response, NextFunction } from 'express';
import User from '../models/user.models';
import { sendSuccess } from '../utils/globalResponse';
import { GlobalError } from '../utils/globalError';
import { asyncController } from '../utils/asyncController';

export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { walletAddress, username } = req.body;

    if (!walletAddress) {
      return next(new GlobalError('Wallet address is required', 400));
    }
    let user = await User.findOne({ walletAddress });
    if (!user && !username) {
      return next(new GlobalError('New wallet detected, username required', 404));
    }
    let message: string;

    if (user) {
      message = 'User logged in successfully';
    } else {
      if (!username) {
        return next(new GlobalError('Username is required for new user registration', 400));
      }
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return next(new GlobalError(`Username '${username}' is already taken`, 409));
      }

      try {
        user = await User.create({ walletAddress, username });
        message = 'User created successfully';
      } catch (error: any) {
        if (error.code === 11000) {
          if (error.keyPattern?.walletAddress) {
            return next(new GlobalError('Wallet address is already registered', 409));
          }
          if (error.keyPattern?.username) {
            return next(new GlobalError(`Username '${username}' is already taken`, 409));
          }
        }
        throw error;
      }
    }
    sendSuccess(res, user ? 200 : 201, user, message);
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const walletAddress = req.params.walletAddress;
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
};


export const restoreReputation = asyncController(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { walletAddress } = req.params;
  const { amount } = req.body;


  const restoreAmount = parseInt(amount) || 50; 
  if (restoreAmount <= 0 || restoreAmount > 200) {
    return next(new GlobalError('Restore amount must be between 1 and 200', 400));
  }


  const user = await User.findOne({ walletAddress });
  if (!user) {
    return next(new GlobalError('User not found', 404));
  }

  const oldReputation = user.reputation;
  
  user.reputation = Math.min(user.reputation + restoreAmount, 100);
  await user.save();

  sendSuccess(res, 200, { 
    user,
    oldReputation,
    newReputation: user.reputation,
    restored: user.reputation - oldReputation
  }, `Reputation restored by ${user.reputation - oldReputation} points.`);
});