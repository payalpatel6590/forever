import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import nodemailer from "nodemailer";


const currency = 'usd';
const deliveryCharge = 10;



const sendInvoiceEmail = async (req, res) => {
  try {
    const { order } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const itemsHtml = order.items.map(item => `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>$${item.price}</td>
      </tr>
    `).join("");

    const html = `
      <div style="font-family: Arial; max-width:600px; margin:auto;">
        <h2 style="text-align:center;">🧾 Invoice</h2>

        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Name:</strong> ${order.address.firstName} ${order.address.lastName}</p>

        <table border="1" width="100%" cellpadding="8" style="border-collapse: collapse;">
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
          </tr>
          ${itemsHtml}
        </table>

        <h3>Total: $${order.amount}</h3>

        <p style="text-align:center;">Thank you for shopping ❤️</p>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: order.address.email,
      subject: "Your Invoice",
      html
    });

    res.json({ success: true });

  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};





// Placing order using COD
const placeOrder = async (req, res) => {
    try {
        const { items, amount, address } = req.body;
        const userId = req.user?.id || req.body?.userId;
        
        if (!userId || amount === undefined) {
             return res.json({ success: false, message: "Missing userId or amount" });
        }

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, { cartData: {} });

       res.json({
            success: true,
            message: "Order Placed",
            order: newOrder, // ✅ REQUIRED for invoice
            });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Placing order using Stripe
const placeOrderStripe = async (req, res) => {
    try {
         const { items, amount, address } = req.body;
         const userId = req.user?.id || req.body?.userId;
         const { origin } = req.headers;
         
         if (!userId || amount === undefined) {
              return res.json({ success: false, message: "Missing userId or amount" });
         }

         const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const line_items = items.map((item) => ({
             price_data: {
                 currency: currency,
                 product_data: {
                     name: item.name
                 },
                 unit_amount: item.price * 100
             },
             quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: 'Delivery Charges'
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        })

            // Mocking Stripe session creation and directly returning success with a mock URL
        const mockStripeUrl = `${origin}/verify?success=true&orderId=${newOrder._id}`;
        
        await userModel.findByIdAndUpdate(userId, { cartData: {} });
        // newOrder.payment = true; // mocking payment success
        await newOrder.save();

        res.json({ success: true, session_url: mockStripeUrl });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// All orders data for admin
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Orders for seller
const sellerOrders = async (req, res) => {
    try {
        
        const orders = await orderModel.find({});
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Last Order Data for frontend
const userOrder = async (req, res) => {
    try {
        const userId = req.user?.id || req.body?.userId; // Get from auth middleware
        const orders = await orderModel.find({ userId }).sort({ date: -1 });
        
        // Check if this is the user-orders endpoint (return all orders) or last endpoint (return last order)
        if (req.originalUrl.includes('/user-orders')) {
            res.json({ success: true, orders: orders || [] });
        } else {
            const lastOrder = orders[0] || null;
            res.json({ success: true, order: lastOrder });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Update order status (Admin)
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: 'Status Updated' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { placeOrder, placeOrderStripe, allOrders, userOrder, updateStatus, sellerOrders, sendInvoiceEmail };
