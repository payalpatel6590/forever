import React, { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../context/ShopContext.jsx";
import { assets } from "../assets/assets";
import RelatedProducts from "../componants/RelatedProducts";
import { Currency } from "lucide-react";

const Product = () => {
  const { productId } = useParams();
  const { products, currancy, addToCart, backendUrl } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  const [activeTab, setActiveTab] = useState("description");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);

  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: 5,
    comment: "",
  });

  const ratingLabels = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };

  useEffect(() => {
    const product = products.find((item) => item._id === productId);

    if (product) {
      setProductData(product);
      setImage(Array.isArray(product.image) ? product.image[0] : product.image);
    }
  }, [products, productId]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/review/${productId}`);
      if (response.data.success) {
        setReviews(response.data.reviews);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddReview = async () => {
    if (reviewForm.name.trim() === "" || reviewForm.comment.trim() === "") {
      alert("Please fill in all review fields");
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/api/review/add`, {
        productId,
        name: reviewForm.name,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment,
      });

      if (response.data.success) {
        setReviewForm({
          name: "",
          rating: 5,
          comment: "",
        });
        setShowReviewForm(false);
        fetchReviews();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  const handleWhatsAppShare = () => {
    if (!productData) return;

    const productLink = `${window.location.origin}/product/${productData._id}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(productLink)}`;

    window.open(whatsappUrl, "_blank");
  };

  const renderStars = (rating, sizeClass = "w-4") => {
    return [...Array(5)].map((_, index) => (
      <img
        key={index}
        className={sizeClass}
        src={index < rating ? assets.star_icon : assets.star_dull_icon}
        alt="star"
      />
    ));
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, item) => sum + Number(item.rating), 0) /
          reviews.length
        ).toFixed(1)
      : 4.0;

  // Proper size order
  const orderedSizes = useMemo(() => {
    if (!productData?.sizes || !Array.isArray(productData.sizes)) return [];

    const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

    return [...productData.sizes].sort((a, b) => {
      const indexA = sizeOrder.indexOf(String(a).toUpperCase());
      const indexB = sizeOrder.indexOf(String(b).toUpperCase());

      if (indexA === -1 && indexB === -1) {
        return String(a).localeCompare(String(b));
      }

      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      return indexA - indexB;
    });
  }, [productData]);

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        <div className="flex flex-1 flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {(Array.isArray(productData.image)
              ? productData.image
              : [productData.image]
            ).map((item, index) => (
              <img
                key={index}
                onClick={() => setImage(item)}
                src={item}
                className={`w-[24%] sm:w-full sm:mb-3 shrink-0 cursor-pointer border ${
                  image === item ? "border-orange-500" : "border-transparent"
                }`}
                alt={productData.name}
              />
            ))}
          </div>

          <div className="w-full sm:w-[80%]">
            <img
              src={image ? image : `${backendUrl}/uploads/default.png`}
              className="w-100 h-120 object-contain"
              alt={productData.name}
            />
          </div>
        </div>

        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>

          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              {renderStars(Math.round(averageRating), "w-3.5")}
            </div>
            <p className="pl-1 text-sm text-gray-600">
              {averageRating} ({reviews.length} review
              {reviews.length !== 1 ? "s" : ""})
            </p>
          </div>

          <p className="mt-5 text-3xl font-medium">
            {currancy}
            {productData.price}
          </p>

          <p className="mt-5 text-xl text-gray-500 md:w-4/5">
            {productData.description}
          </p>

          <div className="flex flex-col gap-4 my-8">
            <p className="text-xl">Select Size</p>

            <div className="flex gap-2 flex-wrap">
              {orderedSizes.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-gray-300 ${
                    item === size ? "border-orange-700 bg-orange-300" : ""
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => {
                if (!size) {
                  alert("Please select a size");
                  return;
                }
                addToCart(productData._id, size);
              }}
              className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
            >
              ADD TO CART
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="bg-green-600 text-white px-8 py-3 text-sm hover:bg-green-700"
            >
              SHARE ON WHATSAPP
            </button>
          </div>

          <hr className="mt-8 sm:w-4/5" />

          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% original product</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <div className="flex flex-wrap">
          <button
            onClick={() => setActiveTab("description")}
            className={`border px-5 py-3 text-lg font-medium ${
              activeTab === "description"
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
          >
            Description
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`border px-5 py-3 text-lg ${
              activeTab === "reviews"
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
          >
            Reviews ({reviews.length})
          </button>
        </div>

        {activeTab === "description" && (
          <div className="flex flex-col gap-4 border px-4 py-6 text-md text-gray-600">
            <p>{productData.description}</p>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="border px-4 py-6">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h2 className="text-2xl font-semibold">Customer Reviews</h2>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    {renderStars(Math.round(averageRating), "w-5")}
                  </div>
                  <span className="text-sm text-gray-600">
                    {averageRating} out of 5
                  </span>
                </div>
              </div>

              {!showReviewForm && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
                >
                  Write a Review
                </button>
              )}
            </div>

            {showReviewForm && (
              <div className="border rounded-xl p-5 mb-8 bg-gray-50 shadow-sm">
                <h3 className="text-lg font-medium mb-4">Write a Review</h3>

                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    name="name"
                    value={reviewForm.name}
                    onChange={handleReviewChange}
                    placeholder="Enter your name"
                    className="border rounded-lg px-4 py-3 outline-none focus:border-black"
                  />

                  <div>
                    <p className="mb-2 font-medium">Your Rating</p>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <img
                          key={star}
                          onClick={() =>
                            setReviewForm((prev) => ({
                              ...prev,
                              rating: star,
                            }))
                          }
                          src={
                            star <= reviewForm.rating
                              ? assets.star_icon
                              : assets.star_dull_icon
                          }
                          alt={`star-${star}`}
                          className="w-7 cursor-pointer transition-transform duration-200 hover:scale-110"
                        />
                      ))}

                      <span className="ml-2 text-sm text-gray-600">
                        {ratingLabels[reviewForm.rating]}
                      </span>
                    </div>
                  </div>

                  <textarea
                    name="comment"
                    value={reviewForm.comment}
                    onChange={handleReviewChange}
                    placeholder="Share your experience about this product..."
                    rows="4"
                    className="border rounded-lg px-4 py-3 outline-none resize-none focus:border-black"
                  />

                  <div className="flex gap-3">
                    <button
                      onClick={handleAddReview}
                      className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
                    >
                      Submit Review
                    </button>

                    <button
                      onClick={() => {
                        setShowReviewForm(false);
                        setReviewForm({
                          name: "",
                          rating: 5,
                          comment: "",
                        });
                      }}
                      className="border px-6 py-3 rounded-lg hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-5">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review._id} className="border-b pb-5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h4 className="font-semibold text-lg">{review.name}</h4>
                        <div className="flex items-center gap-1 mt-1">
                          {renderStars(review.rating, "w-4")}
                        </div>
                      </div>

                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <p className="text-gray-600 mt-3">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">
                  No reviews yet. Be the first to review this product.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;