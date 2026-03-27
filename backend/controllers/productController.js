import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// function for add product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestSeller } = req.body;
        
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                try {
                    let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                    return result.secure_url;
                } catch (err) {
                    console.log("Cloudinary upload failed, falling back to local file:", err.message);
                    return `http://localhost:${process.env.PORT || 4000}/uploads/${item.filename}`;
                }
            })
        );

        let parsedSizes = sizes;
        if (typeof sizes === 'string') {
            try {
                parsedSizes = JSON.parse(sizes);
            } catch {
                parsedSizes = sizes.split(',');
            }
        }

        // Use req.user.id (from auth middleware) or fallback to body
        const sellerId = req.user?.id || req.body.sellerId || null;

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestSeller: bestSeller === "true" || bestSeller === true,
            sizes: parsedSizes,
            image: imagesUrl,
            date: Date.now(),
            sellerId
        }

        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: "Product Added" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// function for list product (public)
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        console.log("Total products in database:", products.length);
        console.log("Products with sellerId:", products.filter(p => p.sellerId).length);
        console.log("Sample products:", products.slice(0, 3).map(p => ({ 
            id: p._id, 
            name: p.name, 
            sellerId: p.sellerId,
            hasSellerId: !!p.sellerId 
        })));
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// function for removing product
const removeProduct = async (req, res) => {
    try {
        const { id } = req.params; 
        const product = await productModel.findById(id);
        
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        const userId = req.user?.id;
        const userRole = req.user?.role;

        // Check ownership or admin status
        if (userRole !== 'admin' && product.sellerId?.toString() !== userId) {
             return res.json({ success: false, message: "Not Authorized to delete this product" });
        }

        await productModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Product Removed" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// single product info
const singleProduct = async (req, res) => {
    try {
        const { id } = req.body;
        const product = await productModel.findById(id);
        res.json({ success: true, product });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// admin list products (sees everything)
const adminListProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// seller list products (filtered by sellerId)
const sellerListProducts = async (req, res) => {
    try {
        // Debug: Log the authenticated user
        console.log("Authenticated user:", req.user);
        console.log("User ID:", req.user?.id);
        
        // req.user.id is populated by your authSeller middleware
        const sellerId = req.user.id; 

        if (!sellerId) {
            console.log("No sellerId found in request");
            return res.json({ success: false, message: "Seller not authenticated" });
        }

        console.log("Fetching products for sellerId:", sellerId);

        // CRITICAL: Find ONLY products that belong to this seller
        const products = await productModel.find({ sellerId: sellerId });
        
        console.log("Found products:", products.length);
        console.log("Products:", products.map(p => ({ id: p._id, name: p.name, sellerId: p.sellerId })));
        
        res.json({ success: true, products });
    } catch (error) {
        console.log("Error in sellerListProducts:", error);
        res.json({ success: false, message: error.message });
    }
}

// Test endpoint to create a sample product
const createTestProduct = async (req, res) => {
    try {
        // Find a seller user
        const seller = await userModel.findOne({ role: 'seller' });
        if (!seller) {
            return res.json({ success: false, message: "No seller found" });
        }

        // Create test product
        const testProduct = new productModel({
            name: 'Test Product for Seller Dashboard',
            description: 'This is a test product to verify seller dashboard functionality',
            price: 39.99,
            image: ['test1.jpg', 'test2.jpg'],
            category: 'Men',
            subCategory: 'Topwear',
            sizes: ['S', 'M', 'L', 'XL'],
            bestSeller: true,
            date: Date.now(),
            sellerId: seller._id
        });

        await testProduct.save();
        
        console.log('Test product created:', testProduct._id);
        
        res.json({ 
            success: true, 
            message: "Test product created successfully",
            product: testProduct
        });
    } catch (error) {
        console.log("Error creating test product:", error);
        res.json({ success: false, message: error.message });
    }
}

export { listProducts, addProduct, removeProduct, singleProduct, adminListProducts, sellerListProducts, createTestProduct };