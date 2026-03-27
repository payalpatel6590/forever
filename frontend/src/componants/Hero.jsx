import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "../constants";
import { hero_img } from "../assets/assets.js";

const AUTO_SLIDE_TIME = 6000;

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();

  // Fallback hero slides for when backend is not available
  const fallbackSlides = [
    {
      _id: 'fallback-1',
      image: hero_img,
      title: "Welcome to Our Store",
      subtitle: "Discover amazing products and exclusive deals",
      tag: "NEW ARRIVAL",
      category: "Featured",
      buttonText: "Shop Now",
    }
  ];

  const fetchHeroSlides = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/hero/list`);

      if (res.data.success) {
        setSlides(res.data.slides?.length > 0 ? res.data.slides : fallbackSlides);
      } else {
        setSlides(fallbackSlides);
      }
    } catch (error) {
      console.log("Hero fetch error:", error);
      // Use fallback slides when backend is not available
      setSlides(fallbackSlides);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroSlides();
  }, []);

  const nextSlide = useCallback(() => {
    if (slides.length === 0) return;
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length === 0) return;
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      nextSlide();
    }, AUTO_SLIDE_TIME);

    return () => clearInterval(interval);
  }, [slides.length, isHovered, nextSlide]);

  const goToCollection = (slide) => {
    window.scrollTo(0, 0);

    const selectedCategory = slide?.categorySlug || slide?.category || "";

    if (selectedCategory) {
      navigate(`/collection?category=${encodeURIComponent(selectedCategory)}`);
    } else {
      navigate("/collection");
    }
  };

  if (loading) {
    return (
      <div className="h-[260px] sm:h-[320px] lg:h-[420px] rounded-3xl bg-gray-100 flex items-center justify-center text-gray-500 text-lg font-medium">
        Loading hero banner...
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="h-[260px] sm:h-[320px] lg:h-[420px] rounded-3xl bg-gray-100 flex items-center justify-center text-gray-500 text-lg font-medium">
        No hero banner found
      </div>
    );
  }

  return (
    <div
      className="relative h-[260px] sm:h-[320px] lg:h-[420px] overflow-hidden rounded-3xl shadow-[0_15px_50px_rgba(0,0,0,0.12)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {slides.map((slide, index) => {
        const isActive = index === current;

        return (
          <div
            key={slide._id || index}
            onClick={() => goToCollection(slide)}
            className={`absolute inset-0 cursor-pointer transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              isActive 
                ? "translate-x-0 opacity-100 z-10" 
                : index < current 
                  ? "-translate-x-full opacity-0 z-0 pointer-events-none" 
                  : "translate-x-full opacity-0 z-0 pointer-events-none"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title || "Hero Banner"}
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/15" />

            <div className="relative z-10 h-full flex items-center">
              <div className="w-full max-w-7xl px-5 sm:px-8 lg:px-14">
                <div className="max-w-xl text-white">
                  {slide.tag && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 mb-3">
                      <span className="w-2 h-2 rounded-full bg-white"></span>
                      <p className="text-[10px] sm:text-xs font-semibold tracking-[2px] uppercase text-white">
                        {slide.tag}
                      </p>
                    </div>
                  )}

                  {slide.category && (
                    <p className="text-xs sm:text-sm uppercase tracking-[3px] text-white/80 mb-2">
                      {slide.category}
                    </p>
                  )}

                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight max-w-xl">
                    {slide.title}
                  </h1>

                  {slide.subtitle && (
                    <p className="mt-3 text-xs sm:text-sm lg:text-base text-white/85 leading-6 max-w-lg">
                      {slide.subtitle}
                    </p>
                  )}

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        goToCollection(slide);
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-sm sm:text-base font-semibold hover:bg-gray-200 transition-all duration-300"
                    >
                      {slide.buttonText || "Shop Now"}
                      <span className="text-base">→</span>
                    </button>

                    {slide.bottomText && (
                      <p className="text-xs sm:text-sm text-white/80 font-medium">
                        {slide.bottomText}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {slides.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-lg font-bold hover:bg-white/30 transition"
            aria-label="Previous Slide"
          >
            ‹
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-lg font-bold hover:bg-white/30 transition"
            aria-label="Next Slide"
          >
            ›
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3 py-2 border border-white/10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrent(index);
                }}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  current === index ? "w-7 bg-white" : "w-2 bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Hero;