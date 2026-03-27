import mongoose from "mongoose";

const promoSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discountValue: { type: Number, required: true },
    maxUses: { type: Number, default: 0 },
    currentUses: { type: Number, default: 0 },
    status: { type: String, default: "Active" }
}, { timestamps: true });

const promoModel = mongoose.models.promo || mongoose.model("promo", promoSchema);

export default promoModel;
