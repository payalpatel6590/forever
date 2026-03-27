import express from 'express';
import { createPromo, validatePromo, listPromos, togglePromo, deletePromo } from '../controllers/promoController.js';
import { authAdmin, authUser } from '../middleware/auth.js';

const promoRouter = express.Router();

// Admin features
promoRouter.post('/create', authAdmin, createPromo);
promoRouter.get('/list', authAdmin, listPromos);
promoRouter.put('/toggle/:id', authAdmin, togglePromo);
promoRouter.delete('/delete/:id', authAdmin, deletePromo);

// User features
promoRouter.post('/validate', authUser, validatePromo);

export default promoRouter;
