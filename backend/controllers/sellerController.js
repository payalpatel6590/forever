import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";

const getDashboardData = async (req, res) => {
    try {
        const sellerId = req.user.id;

        // Fetch products by this seller
        const products = await productModel.find({ sellerId });
        const totalProducts = products.length;

        const lowStock = products.filter((p) => Number(p.stock || 0) > 0 && Number(p.stock || 0) <= 5);

        // Fetch orders. For simplicity, we fetch all orders and filter those containing the seller's products
        // In a real optimized system, order items would have a sellerId reference.
        // Assuming order items don't have sellerId mapped right now, we'll return mock/basic data.
        const allOrders = await orderModel.find({});
        
        // This is a simplified dashboard response
        res.json({
            success: true,
            totalProducts,
            totalOrders: allOrders.length, // Placeholder
            revenue: 0, // Placeholder
            todayOrders: 0, // Placeholder
            topProducts: [], // Placeholder
            lowStock: lowStock,
            chart: [], // Placeholder
            orders: allOrders
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { getDashboardData };
