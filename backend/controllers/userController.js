import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail, emailTemplates } from "../config/email.cjs";

const createToken = (id, role = 'buyer') => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// Route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await userModel.findOne({ email });
        
        if (!user) {
            return res.json({ success: false, message: "User doesn't exists" });
        }

        const userRole = user.role || 'buyer';

        if (userRole !== 'buyer') {
             return res.json({ success: false, message: "Use Panel Login for Seller/Admin accounts" });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (isMatch) {
            const token = createToken(user._id, userRole);
            res.json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email } });
            
            // Send login notification email
            try {
                await sendEmail({
                    to: user.email,
                    ...emailTemplates.login(user.name)
                });
            } catch (emailError) {
                console.log('Login email error:', emailError);
            }
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Route for panel login (Admin & Seller)
const panelLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = createToken(email + password, 'admin');
            return res.json({ success: true, token, role: 'admin' });
        }
        
        const user = await userModel.findOne({ email });
        
        if (!user) {
            return res.json({ success: false, message: "User doesn't exists" });
        }

        if (user.role === 'buyer') {
            return res.json({ success: false, message: "Not authorized for Panel Login" });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (isMatch) {
            const token = createToken(user._id, user.role);
            res.json({ success: true, token, role: user.role, user: { _id: user._id, name: user.name, email: user.email } });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Route for user register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // checking user already exists or not
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        // validating email format & strong password
        if (!validator.isEmail(email)) {
             return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
             return res.json({ success: false, message: "Please enter a strong password" });
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
             email,
             password: hashedPassword,
             role: 'buyer'
        })
        
        const user = await newUser.save();

        const token = createToken(user._id, user.role);
        
        // Send welcome email
        try {
            await sendEmail({
                to: user.email,
                ...emailTemplates.welcome(user.name)
            });
        } catch (emailError) {
            console.log('Welcome email error:', emailError);
        }
        
        res.json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email } });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Route for seller signup
const sellerSignup = async (req, res) => {
    try {
        const { name, email, password, number } = req.body;

        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
             return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
             return res.json({ success: false, message: "Please enter a strong password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newSeller = new userModel({
            name,
            email,
            password: hashedPassword,
            number,
            role: 'seller'
        })
        
        const seller = await newSeller.save();

        const token = createToken(seller._id, seller.role);
        
        res.json({ success: true, token, role: seller.role });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Route for verify OTP (stub)
const verifyOtp = async (req, res) => {
     // Stub implementation - assuming any OTP is valid for now 
     // as requested simply to restore functionality quickly.
     try {
         const { email } = req.body;
         const user = await userModel.findOne({ email });
         if (!user) return res.json({success: false, message: "User not found"});

         res.json({ success: true, message: "OTP Verified" });
     } catch (err) {
         res.json({ success: false, message: err.message });
     }
}

// Route for reset password (stub)
const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await userModel.findOne({ email });
        
        if(!user) return res.json({success: false, message: "User not found"});

        if (newPassword.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();

        res.json({ success: true, message: "Password updated successfully" });
    } catch(err) {
        res.json({ success: false, message: err.message });
    }
}

// Route for list users (admin)
const listUsers = async (req, res) => {
    try {
        const users = await userModel.find({});
        res.json({ success: true, users });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { loginUser, registerUser, panelLogin, sellerSignup, verifyOtp, resetPassword, listUsers };
