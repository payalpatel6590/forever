import express from 'express';
import { listProducts, addProduct, removeProduct, singleProduct, adminListProducts, sellerListProducts, createTestProduct } from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import { authAdmin, authSeller } from '../middleware/auth.js';

const productRouter = express.Router();

// Routes for adding and getting single info
productRouter.post('/add', authSeller, upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }]), addProduct);
productRouter.post('/single', singleProduct);

// Updated Remove Route to use DELETE and handle ID param
productRouter.delete('/remove/:id', authSeller, removeProduct);

// Specific list routes
productRouter.get('/admin-list', authAdmin, adminListProducts);
productRouter.get('/seller-list', authSeller, sellerListProducts);
productRouter.get('/list', listProducts);

// Test endpoint (temporary - remove after testing)
productRouter.post('/create-test', createTestProduct);

export default productRouter;