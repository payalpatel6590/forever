import mongoose from "mongoose";

const heroSchema = new mongoose.Schema({
    image: { type: String, required: true },
    tag: { type: String, default: "" },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    buttonText: { type: String, default: "" },
    category: { type: String, default: "" },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const heroModel = mongoose.models.hero || mongoose.model("hero", heroSchema);

export default heroModel;
