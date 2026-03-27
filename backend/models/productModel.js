import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Array, required: true }, // array of image URLs
    category: { type: String, required: true }, // Men, Women, Kids
    subCategory: { type: String, required: true }, // Topwear, Bottomwear, Winterwear
    sizes: { type: Array, required: true },
    bestSeller: { type: Boolean },
    date: { type: Number, required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' } // for seller-specific filtering
}, { timestamps: true });

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
