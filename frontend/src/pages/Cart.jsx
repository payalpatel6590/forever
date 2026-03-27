import React, { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext.jsx";
import Title from "../componants/Title";
import { assets } from "../assets/assets";
import CartTotal from "../componants/CartTotal";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    products,
    cartItems,
    currancy,
    updateQuantity,
    token,
    getUserCart,
  } = useContext(ShopContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (token) getUserCart();
  }, [token]);

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      <div>
        {Object.entries(cartItems).map(([productId, sizes]) =>
          Object.entries(sizes).map(([size, quantity]) => {
            if (quantity <= 0) return null;

            const productData = products.find((p) => p._id === productId);
            if (!productData) return null;

            return (
              <div
                key={`${productId}-${size}`}
                className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
              >
                <div className="flex items-start gap-6">
                  <img
                    src={productData.image?.[0] || ""}
                    className="w-16 sm:w-20"
                    alt=""
                  />
                  <div>
                    <p className="text-xs sm:text-lg font-medium">
                      {productData.name}
                    </p>
                    <div className="flex font-bold items-center gap-5 mt-2">
                      <p>
                        {currancy}
                        {productData.price}
                      </p>
                      <p className="px-2 sm:px-3 border bg-slate-100">{size}</p>
                    </div>
                  </div>
                </div>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) =>
                    e.target.value === "" || e.target.value === "0"
                      ? null
                      : updateQuantity(productId, size, Number(e.target.value))
                  }
                  className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                />
                <img
                  src={assets.bin_icon}
                  className="w-4 mr-4 sm:w-5 cursor-pointer"
                  alt=""
                  onClick={() => updateQuantity(productId, size, 0)}
                />
              </div>
            );
          })
        )}
      </div>

      <div className="flex justify-end my-20">
        <div className="w-full sm:w[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button
              onClick={() => navigate("/place-order")}
              className="bg-black text-white text-sm my-8 px-8 py-3"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;