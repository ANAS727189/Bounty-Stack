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
  
  console.log('METHOD:', req.method);
  console.log('HEADERS:', req.headers['content-type']);
  console.log('BODY:', req.body);

  // --- START FIX ---
  // 1. Check for the header first. This is the standard method.
  if (req.headers['x-wallet-address']) {
    walletAddress = req.headers['x-wallet-address'] as string;
  } 
  // 2. Only check the body if the header is not present AND the body exists.
  else if (req.body) {
    if (req.body.askerWallet) {
      walletAddress = req.body.askerWallet;
    } else if (req.body.answererWallet) {
      walletAddress = req.body.answererWallet;
    } else if (req.body.walletAddress) { 
        walletAddress = req.body.walletAddress;
    }
  }
  // --- END FIX ---

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