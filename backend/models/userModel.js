import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' },
    cartData: { type: Object, default: {} },
    number: { type: String } // optional, referenced in seller signup
}, { minimize: false, timestamps: true });

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;
