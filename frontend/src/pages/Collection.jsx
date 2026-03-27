import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext.jsx";
import { assets } from "../assets/assets";
import Title from "../componants/Title";
import ProductItem from "../componants/ProductItem";

const Collection = () => {
  const { products, search } = useContext(ShopContext);
  const [searchParams] = useSearchParams();

  const [showFilter, setShowFilter] = useState(false);
  const [category, setCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");
  const [currentPage, setCurrentPage] = useState(1);
  const [showSort, setShowSort] = useState(false);
  const [maxPrice, setMaxPrice] = useState(100);

  const sortRef = useRef(null);

  const itemsPerPage = 16;
  const urlCategory = searchParams.get("category");

  useEffect(() => {
    if (urlCategory) {
      const normalizedUrlCategory = urlCategory.trim().toLowerCase();

      if (normalizedUrlCategory === "men") {
        setCategory(["Men"]);
      } else if (normalizedUrlCategory === "women") {
        setCategory(["Women"]);
      } else if (normalizedUrlCategory === "kids") {
        setCategory(["Kids"]);
      }
    } else {
      setCategory([]);
    }
  }, [urlCategory]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setShowSort(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleCategory = (e) => {
    const value = e.target.value;

    if (category.includes(value)) {
      setCategory((prev) => prev.filter((item) => item !== value));
    } else {
      setCategory((prev) => [...prev, value]);
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    let productsCopy = [...products];

    if (search) {
      productsCopy = productsCopy.filter((item) =>
        item.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.some(
          (cat) => cat.toLowerCase() === item.category?.trim().toLowerCase()
        )
      );
    }

    // Price range filter: $1 to selected max price
    productsCopy = productsCopy.filter((item) => {
      const price = Number(item.price);
      return price >= 1 && price <= maxPrice;
    });

    if (sortType === "low-high") {
      productsCopy.sort((a, b) => a.price - b.price);
    } else if (sortType === "high-low") {
      productsCopy.sort((a, b) => b.price - a.price);
    }

    return productsCopy;
  }, [products, search, category, sortType, maxPrice]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, sortType, urlCategory, maxPrice]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedProducts.slice(startIndex, endIndex);
  }, [filteredAndSortedProducts, currentPage]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage, urlCategory]);

  const getVisiblePages = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage === 1) {
      return [1, 2, 3];
    }

    if (currentPage === totalPages) {
      return [totalPages - 2, totalPages - 1, totalPages];
    }

    return [currentPage - 1, currentPage, currentPage + 1];
  };

  const visiblePages = getVisiblePages();

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleSortChange = (value) => {
    setSortType(value);
    setShowSort(false);
  };

  const getSortLabel = () => {
    if (sortType === "low-high") return "Price: Low to High";
    if (sortType === "high-low") return "Price: High to Low";
    return "Sort by Relevant";
  };

  return (
    <div className="flex flex-col sm:flex-row gap-10 pt-10 border-t">
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS
          <img className="h-3 sm:hidden" src={assets.dropdown_icon} alt="" />
        </p>

        <div
          className={`border border-gray-300 pl-5 pr-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORY</p>

          <label className="flex gap-2 mb-2 cursor-pointer">
            <input
              type="checkbox"
              value="Men"
              checked={category.includes("Men")}
              onChange={toggleCategory}
            />
            Men
          </label>

          <label className="flex gap-2 mb-2 cursor-pointer">
            <input
              type="checkbox"
              value="Women"
              checked={category.includes("Women")}
              onChange={toggleCategory}
            />
            Women
          </label>

          <label className="flex gap-2 mb-2 cursor-pointer">
            <input
              type="checkbox"
              value="Kids"
              checked={category.includes("Kids")}
              onChange={toggleCategory}
            />
            Kids
          </label>

          {/* Price Range Filter */}
          <div className="mt-6 border-t pt-4">
            <p className="mb-3 text-sm font-medium">PRICE RANGE</p>

            <div className="mb-3 text-sm text-gray-600">
              $1 - ${maxPrice}
            </div>

            <input
              type="range"
              min="1"
              max="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full cursor-pointer"
            />

            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>$1</span>
              <span>$100</span>
            </div>

            <button
              onClick={() => setMaxPrice(100)}
              className="mt-4 w-full border border-gray-300 rounded-lg py-2 text-sm hover:bg-black hover:text-white transition-all duration-300"
            >
              Reset Price
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
          <Title
            text1={category.length > 0 ? category[0].toUpperCase() : "ALL"}
            text2={"COLLECTIONS"}
          />

          <div className="relative" ref={sortRef}>
            <button
              type="button"
              onClick={() => setShowSort((prev) => !prev)}
              className="min-w-[220px] flex items-center justify-between gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:border-black hover:shadow-md"
            >
              <span>{getSortLabel()}</span>
              <span
                className={`text-xs transition-transform duration-300 ${
                  showSort ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {showSort && (
              <div className="absolute right-0 top-full z-20 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                <button
                  type="button"
                  onClick={() => handleSortChange("relevant")}
                  className={`group relative flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-all duration-200 ${
                    sortType === "relevant"
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:pl-5"
                  }`}
                >
                  <span className="absolute left-0 top-0 h-full w-1 bg-black opacity-0 transition-all duration-200 group-hover:opacity-100"></span>
                  <span className="transition-all duration-200 group-hover:translate-x-1">
                    Sort by Relevant
                  </span>
                  {sortType === "relevant" && <span>✓</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleSortChange("low-high")}
                  className={`group relative flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-all duration-200 ${
                    sortType === "low-high"
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:pl-5"
                  }`}
                >
                  <span className="absolute left-0 top-0 h-full w-1 bg-black opacity-0 transition-all duration-200 group-hover:opacity-100"></span>
                  <span className="transition-all duration-200 group-hover:translate-x-1">
                    Price: Low to High
                  </span>
                  {sortType === "low-high" && <span>✓</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleSortChange("high-low")}
                  className={`group relative flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-all duration-200 ${
                    sortType === "high-low"
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:pl-5"
                  }`}
                >
                  <span className="absolute left-0 top-0 h-full w-1 bg-black opacity-0 transition-all duration-200 group-hover:opacity-100"></span>
                  <span className="transition-all duration-200 group-hover:translate-x-1">
                    Price: High to Low
                  </span>
                  {sortType === "high-low" && <span>✓</span>}
                </button>
              </div>
            )}
          </div>
        </div>

        {filteredAndSortedProducts.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-gray-500 text-lg">
            No products found
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-500">
              Showing products in range: <span className="font-medium">$1 - ${maxPrice}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginatedProducts.map((item) => (
                <ProductItem
                  key={item._id}
                  id={item._id}
                  name={item.name}
                  price={item.price}
                  image={item.image}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                    currentPage === 1
                      ? "cursor-not-allowed text-gray-400 border-gray-200 bg-gray-100"
                      : "border-gray-300 text-black hover:bg-black hover:text-white"
                  }`}
                >
                  Prev
                </button>

                {visiblePages.map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-lg border text-sm font-semibold transition-all duration-200 ${
                      currentPage === page
                        ? "bg-black text-white border-black shadow-md"
                        : "border-gray-300 text-black hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                    currentPage === totalPages
                      ? "cursor-not-allowed text-gray-400 border-gray-200 bg-gray-100"
                      : "border-gray-300 text-black hover:bg-black hover:text-white"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Collection;