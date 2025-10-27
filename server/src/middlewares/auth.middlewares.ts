import { Request, Response, NextFunction } from 'express';
import User from '../models/user.models'; 
import { GlobalError } from '../utils/globalError';
import { asyncController } from '../utils/asyncController'; 


declare global {
  namespace Express {
    interface Request {
      user?: import('../models/user.models').IUser; 
      walletAddress?: string;
    }
  }
}


export const protect = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  let walletAddress: string | undefined;

  if (req.body.askerWallet) {
    walletAddress = req.body.askerWallet;
  } else if (req.body.answererWallet) {
    walletAddress = req.body.answererWallet;
  } else if (req.headers['x-wallet-address']) {
    walletAddress = req.headers['x-wallet-address'] as string;
  } else if (req.body.walletAddress) { 
      walletAddress = req.body.walletAddress;
  }

  if (!walletAddress) {
    return next(
      new GlobalError('Authentication failed: Wallet address not provided.', 401) // 401 Unauthorized
    );
  }

  const currentUser = await User.findOne({ walletAddress });
  if (!currentUser) {
    console.warn(`Auth Warning: User profile not found for wallet ${walletAddress}, but proceeding.`);
     return next(
       new GlobalError('Authentication failed: User profile not found for this wallet.', 401)
     );
  }
  req.walletAddress = walletAddress;
  if (currentUser) {
      req.user = currentUser;
  }


  next();
});