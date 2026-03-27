import reviewModel from "../models/reviewModel.js";

// Add review
const addReview = async (req, res) => {
    try {
        const { userId, productId, rating, text } = req.body;

        const review = new reviewModel({
            userId,
            productId,
            rating,
            text
        });

        await review.save();
        res.json({ success: true, message: "Review Added" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get reviews for a product
const getReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await reviewModel.find({ productId }).populate('userId', 'name');
        res.json({ success: true, reviews });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addReview, getReviews };
