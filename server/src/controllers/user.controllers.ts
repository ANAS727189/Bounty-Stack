import { Request, Response, NextFunction } from 'express';
import User from '../models/user.models';
import { sendSuccess } from '../utils/globalResponse';
import { GlobalError } from '../utils/globalError';


export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
  const { walletAddress, username } = req.body;

    if (!walletAddress) {
      return next(new GlobalError('Wallet address is required', 400));
    }
    let user = await User.findOne({ walletAddress });
    let message: string;

    if (user) {
      message = 'User logged in successfully';
    } else {
      if (!username) {
        return next(new GlobalError('Username is required for new user registration', 400));
      }
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return next(new GlobalError(`Username '${username}' is already taken`, 409)); // 409 Conflict
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
}