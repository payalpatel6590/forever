import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log("DB Connected");
    });
    mongoose.connection.on('error', (err) => {
        console.log("DB Connection Error: ", err);
    });

    if (!process.env.MONGODB_URI) {
        console.log("WAITING FOR MONGODB_URI. DB connect skipped.");
        return;
    }

    try {
        const uri = process.env.MONGODB_URI.endsWith('/') ? process.env.MONGODB_URI.slice(0, -1) : process.env.MONGODB_URI;
        await mongoose.connect(`${uri}/ecommerce`);
    } catch (error) {
        console.log("Database connection failed", error);
    }
};

export default connectDB;
