import mongoose from 'mongoose';
import productModel from './models/productModel.js';
import userModel from './models/userModel.js';

async function addTestProduct() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Find a seller user
    const seller = await userModel.findOne({ role: 'seller' });
    if (!seller) {
      console.log('No seller found. Creating a test seller...');
      
      // Create a test seller
      const testSeller = new userModel({
        name: 'Test Seller',
        email: 'seller@test.com',
        password: 'password123', // This will be hashed by pre-save middleware
        role: 'seller'
      });
      
      const savedSeller = await testSeller.save();
      console.log('Test seller created:', savedSeller._id);
      
      // Add test product for the new seller
      const testProduct = new productModel({
        name: 'Test Product for Seller',
        description: 'This is a test product for seller dashboard',
        price: 29.99,
        image: ['test1.jpg', 'test2.jpg'],
        category: 'Men',
        subCategory: 'Topwear',
        sizes: ['S', 'M', 'L', 'XL'],
        bestSeller: true,
        date: Date.now(),
        sellerId: savedSeller._id
      });
      
      await testProduct.save();
      console.log('Test product added for new seller');
      
    } else {
      console.log('Found seller:', seller._id);
      
      // Add test product for existing seller
      const testProduct = new productModel({
        name: 'Test Product for Existing Seller',
        description: 'This is a test product for existing seller dashboard',
        price: 49.99,
        image: ['test3.jpg', 'test4.jpg'],
        category: 'Women',
        subCategory: 'Bottomwear',
        sizes: ['S', 'M', 'L'],
        bestSeller: false,
        date: Date.now(),
        sellerId: seller._id
      });
      
      await testProduct.save();
      console.log('Test product added for existing seller');
    }

    // List all products to verify
    const allProducts = await productModel.find({});
    console.log('Total products in database:', allProducts.length);
    
    const sellerProducts = await productModel.find({ sellerId: seller._id });
    console.log('Products for seller:', sellerProducts.length);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addTestProduct();
