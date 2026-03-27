import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext.jsx";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price }) => {
  const { currancy } = useContext(ShopContext);

  // Handle image properly - it could be string or array
  const getImageUrl = (img) => {
    if (!img) return "";
    if (Array.isArray(img)) return img[0];
    return img;
  };

  return (
    <Link className="text-gray-700 cursor-pointer" to={`/product/${id}`}>
      <div className="overflow-hidden">
        <img
          className="hover:scale-110 transition ease-in-out w-full h-70 object-cover"
          src={getImageUrl(image)}
          alt={name}
        />
        <p className="pt-8 pb-1 text-md"> {name}</p>
        <p className="text-md font-bold">
          {currancy}
          {price}
        </p>
      </div>
    </Link>
  );
};

export default ProductItem;
