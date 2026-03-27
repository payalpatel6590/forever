import express from 'express';
import { listHero, adminListHero, addHero, toggleBanner, deleteBanner } from '../controllers/heroController.js';
import { authAdmin } from '../middleware/auth.js';
import upload from '../middleware/multer.js';

const heroRouter = express.Router();

heroRouter.get('/list', listHero); // public
heroRouter.get('/admin-list', authAdmin, adminListHero);
heroRouter.post('/add', authAdmin, upload.fields([{name: 'image', maxCount: 1}]), addHero);
heroRouter.put('/toggle/:id', authAdmin, toggleBanner);
heroRouter.delete('/delete/:id', authAdmin, deleteBanner);

export default heroRouter;
