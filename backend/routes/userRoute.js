import express from 'express';
import { 
  loginUser, 
  registerUser, 
  panelLogin, 
  sellerSignup, 
  verifyOtp, 
  resetPassword,
  listUsers
} from '../controllers/userController.js';

import { authAdmin } from '../middleware/auth.js'; // ✅ FIX ADDED

const userRouter = express.Router();

// Auth Routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/panel-login', panelLogin);

// Seller Signup
userRouter.post('/seller-signup', sellerSignup);

// OTP + Password
userRouter.post('/verify-otp', verifyOtp);
userRouter.post('/reset-password', resetPassword);

// ✅ Admin Protected Route
userRouter.post('/list', authAdmin, listUsers);

export default userRouter;