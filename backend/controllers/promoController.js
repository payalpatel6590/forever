import promoModel from "../models/promoModel.js";

const createPromo = async (req, res) => {
    try {
        const { code, discountValue, maxUses } = req.body;
        
        const exists = await promoModel.findOne({ code });
        if (exists) {
            return res.json({ success: false, message: "Promo code already exists" });
        }
        
        const promo = new promoModel({
            code,
            discountValue,
            maxUses
        });
        
        await promo.save();
        res.json({ success: true, message: "Promo code created successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const validatePromo = async (req, res) => {
    try {
        const { code, amount } = req.body;
        const promo = await promoModel.findOne({ code });
        
        if (!promo) {
            return res.json({ success: false, message: "Invalid promo code" });
        }
        
        if (promo.status !== "Active") {
            return res.json({ success: false, message: "Promo code is inactive" });
        }
        
        if (promo.maxUses > 0 && promo.currentUses >= promo.maxUses) {
            return res.json({ success: false, message: "Promo code usage limit reached" });
        }
        
        res.json({ success: true, message: "Promo code applied", discount: promo.discountValue });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const listPromos = async (req, res) => {
    try {
        const promos = await promoModel.find({});
        res.json({ success: true, promos });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const togglePromo = async (req, res) => {
    try {
        const { id } = req.params;
        const promo = await promoModel.findById(id);
        if (!promo) return res.json({ success: false, message: "Promo not found" });
        
        promo.status = promo.status === "Active" ? "Inactive" : "Active";
        await promo.save();
        res.json({ success: true, message: "Promo status updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const deletePromo = async (req, res) => {
    try {
        const { id } = req.params;
        await promoModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Promo deleted" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { createPromo, validatePromo, listPromos, togglePromo, deletePromo };
