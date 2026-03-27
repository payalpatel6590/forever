import userModel from "../models/userModel.js";

// GET /api/profile
const getProfile = async (req, res) => {
    try {
        const userId = req.user?.id || req.body?.userId;
        const user = await userModel.findById(userId).select('-password');
        
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        
        res.json({ success: true, user });
    } catch (error) {
        console.log("Error in getProfile:", error);
        res.json({ success: false, message: error.message });
    }
};

// PUT /api/profile/update
const updateProfile = async (req, res) => {
    try {
        const userId = req.user?.id || req.body?.userId;
        const { name, email, phone, address } = req.body;
        
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        
        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        user.address = address || user.address;
        
        await user.save();
        
        res.json({ 
            success: true, 
            message: "Profile updated", 
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address
            } 
        });
    } catch (error) {
        console.log("Error in updateProfile:", error);
        res.json({ success: false, message: error.message });
    }
}

export { getProfile, updateProfile };
