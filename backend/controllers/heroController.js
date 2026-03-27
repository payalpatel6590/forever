import heroModel from "../models/heroModel.js";
import { v2 as cloudinary } from "cloudinary";

// list active hero banners (for frontend)
const listHero = async (req, res) => {
    try {
        const banners = await heroModel.find({ isActive: true });
        res.json({ success: true, slides: banners }); // Frontend expects 'slides' in res.data.slides
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// list all hero banners (for admin)
const adminListHero = async (req, res) => {
    try {
        const banners = await heroModel.find({});
        res.json({ success: true, banners });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// add a hero banner
const addHero = async (req, res) => {
    try {
        const { tag, title, subtitle, buttonText, category } = req.body;
        const imageFile = req.files.image && req.files.image[0];
        
        if (!imageFile) {
            return res.json({ success: false, message: "No image provided" });
        }

        let imageUrl = '';
        try {
            const result = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
            imageUrl = result.secure_url;
        } catch (err) {
            console.log("Cloudinary hero upload failed, using local file:", err.message);
            imageUrl = `http://localhost:${process.env.PORT || 4000}/uploads/${imageFile.filename}`;
        }
        
        const hero = new heroModel({
            image: imageUrl,
            tag,
            title,
            subtitle,
            buttonText,
            category,
            isActive: true
        });
        
        await hero.save();
        
        res.json({ success: true, message: "Hero Banner Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// toggle active status
const toggleBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const banner = await heroModel.findById(id);
        if (!banner) return res.json({ success: false, message: "Banner not found" });
        
        banner.isActive = !banner.isActive;
        await banner.save();
        
        res.json({ success: true, message: banner.isActive ? "Banner Activated" : "Banner Deactivated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// delete banner
const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        await heroModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Banner Deleted" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { listHero, adminListHero, addHero, toggleBanner, deleteBanner };
