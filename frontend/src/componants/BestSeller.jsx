import React, { useContext, useEffect, useMemo, useState } from "react";
import { ShopContext } from "../context/ShopContext.jsx";
import Title from "./Title";
import ProductItem from "./ProductItem";

const BestSeller = () => {
  const { products } = useContext(ShopContext);

  // Get bestseller products
  const rawBestSeller = products.filter((item) => item.bestseller === true);

  // Make sure at least 5 items exist for proper slider UI
  const bestSeller = useMemo(() => {
    if (rawBestSeller.length === 0) return [];

    if (rawBestSeller.length >= 5) return rawBestSeller;

    const filled = [...rawBestSeller];
    let i = 0;

    while (filled.length < 5) {
      filled.push(rawBestSeller[i % rawBestSeller.length]);
      i++;
    }

    return filled;
  }, [rawBestSeller]);

  // Clone first 5 items at end for infinite smooth loop
  const sliderItems = useMemo(() => {
    if (bestSeller.length === 0) return [];
    return [...bestSeller, ...bestSeller.slice(0, 5)];
  }, [bestSeller]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);

  const nextSlide = () => {
    if (bestSeller.length === 0) return;
    setCurrentIndex((prev) => prev + 1);
    setIsTransitionEnabled(true);
  };

  const prevSlide = () => {
    if (bestSeller.length === 0) return;

    // for smooth previous movement from start
    if (currentIndex === 0) {
      setIsTransitionEnabled(false);
      setCurrentIndex(bestSeller.length);

      setTimeout(() => {
        setIsTransitionEnabled(true);
        setCurrentIndex(bestSeller.length - 1);
      }, 20);
    } else {
      setIsTransitionEnabled(true);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Auto slide every 15 sec
  useEffect(() => {
    if (bestSeller.length === 0) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [bestSeller.length]);

  // Reset instantly when last cloned slide reached
  const handleTransitionEnd = () => {
    if (currentIndex === bestSeller.length) {
      setIsTransitionEnabled(false);
      setCurrentIndex(0);
    }
  };

  // Re-enable transition after reset
  useEffect(() => {
    if (!isTransitionEnabled) {
      const id = setTimeout(() => {
        setIsTransitionEnabled(true);
      }, 30);

      return () => clearTimeout(id);
    }
  }, [isTransitionEnabled]);

  if (bestSeller.length === 0) return null;

  return (
    <div className="my-10 px-4">
      <div className="text-center text-3xl py-8">
        <Title text1={"BEST"} text2={"SELLERS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
      </div>

      <div className="relative flex items-center">
        {/* Left Button */}
        <button
          onClick={prevSlide}
          className="absolute left-0 z-10 bg-white/80 hover:bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold"
        >
          &lt;
        </button>

        {/* Slider Wrapper */}
        <div className="overflow-hidden w-full mx-12">
          <div
            className="flex"
            style={{
              transform: `translateX(-${currentIndex * 20}%)`,
              transition: isTransitionEnabled
                ? "transform 0.7s ease-in-out"
                : "none",
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {sliderItems.map((item, index) => (
              <div
                key={`${item._id}-${index}`}
                className="w-[20%] flex-shrink-0 px-2"
              >
                <ProductItem
                  id={item._id}
                  image={item.image}
                  name={item.name}
                  price={item.price}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Button */}
        <button
          onClick={nextSlide}
          className="absolute right-0 z-10 bg-white/80 hover:bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default BestSeller;