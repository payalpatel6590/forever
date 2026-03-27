import express from 'express';
import { applyJob } from '../controllers/jobController.js';
import upload from '../middleware/multer.js';

const jobRouter = express.Router();

jobRouter.post('/apply', upload.single('resume'), applyJob);

export default jobRouter;
