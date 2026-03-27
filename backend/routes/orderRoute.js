import express from 'express';
import { placeOrder, placeOrderStripe, allOrders, userOrder, updateStatus, sellerOrders, sendInvoiceEmail } from '../controllers/orderController.js';
import { authUser, authAdmin, authSeller } from '../middleware/auth.js';

const orderRouter = express.Router();

// Admin features
orderRouter.post('/list', authAdmin, allOrders); // Admin Panel calls POST /api/order/list
orderRouter.post('/status', authAdmin, updateStatus);

// Seller features
orderRouter.get('/seller-list', authSeller, sellerOrders);
orderRouter.post('/seller-status', authSeller, updateStatus); // reusing updateStatus



// User features
orderRouter.get('/last', authUser, userOrder);
orderRouter.get('/user-orders', authUser, userOrder); // Reuse userOrder to get all user orders
orderRouter.post('/place', authUser, placeOrder);
orderRouter.post('/place-stripe', authUser, placeOrderStripe);
orderRouter.post("/send-invoice", sendInvoiceEmail);

export default orderRouter;
