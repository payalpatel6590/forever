import express from 'express';
import { getDashboardData } from '../controllers/sellerController.js';
import { authSeller } from '../middleware/auth.js';

const sellerRouter = express.Router();

sellerRouter.get('/dashboard', authSeller, getDashboardData);

export default sellerRouter;
