import express from 'express';
import { 
  loginUser, 
  getUserProfile,
  restoreReputation
} from '../controllers/user.controllers';
import { protect } from '../middlewares/auth.middlewares';

const userRouter = express.Router();

userRouter.post('/login', loginUser);
userRouter.get('/profile/:walletAddress', getUserProfile);


userRouter.patch('/:walletAddress/restore-reputation', protect, restoreReputation);

export default userRouter;