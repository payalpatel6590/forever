import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext.jsx";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { Link } from "react-router-dom";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 15));
  }, [products]);

  return (
    <div className="my-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center py-8 text-3xl">
        <Title text1={"LATEST"} text2={"COLLECTIONS"} />
        <p className="w-full sm:w-3/4 md:w-2/3 m-auto mt-3 text-xs sm:text-sm md:text-base text-gray-600 leading-6">
          Discover our newest arrivals, carefully selected to bring fresh style,
          comfort, and quality to your collection.
        </p>
      </div>

      {/* rendering products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {latestProducts.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>

      {/* View More Button */}
      <div className="flex justify-end mt-10">

        <Link to="/collection">
          <button className="px-8 py-3 bg-black text-white rounded-md hover:bg-gray-300 hover:text-black transition-all duration-300">
            View More
          </button>
        </Link>

      </div>
    </div>
  );
};

export default LatestCollection;