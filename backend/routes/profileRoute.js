import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { authUser } from '../middleware/auth.js';

const profileRouter = express.Router();

profileRouter.get('/', authUser, getProfile);
profileRouter.put('/update', authUser, updateProfile);

export default profileRouter;
