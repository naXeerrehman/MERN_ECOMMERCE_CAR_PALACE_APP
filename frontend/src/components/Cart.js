import React, { useState, useEffect } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0); // Default discount to 0
  const [couponMessage, setCouponMessage] = useState("");
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cartItems")) || []
  );

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleRemoveFromCart = (id) => {
    const updatedCartItems = cartItems.filter((item) => item._id !== id);
    setCartItems(updatedCartItems);
  };

  const updateCartItemQuantity = (id, quantity) => {
    const updatedCartItems = cartItems.map((item) =>
      item._id === id
        ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) }
        : item
    );
    setCartItems(updatedCartItems);
  };

  const totalCost = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const verifyCoupon = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/coupons/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode }),
      });

      if (response.ok) {
        const { discount: appliedDiscount } = await response.json();
        setDiscount(appliedDiscount); // Apply the discount from the server
        setCouponMessage(`Coupon applied! ${appliedDiscount}% discount.`);
        setTimeout(() => setCouponMessage(""), 2000);
      } else {
        setDiscount(0); // Reset discount to 0 if coupon is invalid
        setCouponMessage("Invalid or expired coupon.");
        setTimeout(() => setCouponMessage(""), 2000);
      }
    } catch (error) {
      console.error("Failed to verify coupon", error);
      setDiscount(0); // Reset discount on error
    }
  };

  const discountedTotalCost =
    discount > 0 ? totalCost - (totalCost * discount) / 100 : totalCost;

  // If no discount is applied, show the discount explicitly as 0.
  const displayDiscountedTotal = discount > 0 ? discountedTotalCost : 0;

  const handlePaymentMethodSelection = (paymentMethod) => {
    navigate("/CheckoutDetails", {
      state: {
        paymentMethod,
        cartItems,
        discount,
        totalCost: discountedTotalCost,
      },
    });
  };

  return (
    <div className="mt-[40px] w-[700px] mx-3 lg:mx-auto mb-5">
      <h2 className="text-2xl font-semibold mb-4 bg-black text-white w-[150px] text-center mx-[150px] rounded-md">
        Cart
      </h2>

      {couponMessage && (
        <div className="bg-gray-600 text-white p-2 mb-4 rounded-md w-[400px] text-center mx-[40px]">
          {couponMessage}
        </div>
      )}

      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        cartItems.map((item) => (
          <div key={item._id} className="border mb-4 flex items-center gap-x-3">
            <div className="flex-shrink-0 w-[420px] h-[230px] overflow-hidden">
              <img
                src={item.imageUrls && item.imageUrls[0]}
                alt={`${item.model} - ${item.brand}`}
                className="w-full h-[200px] object-cover"
              />
            </div>
            <div>
              <h3>{item.type}</h3>
              <h3>{item.model}</h3>
              <p>{item.brand}</p>
              <p>Price: ${item.price}</p>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() =>
                    updateCartItemQuantity(item._id, item.quantity - 1)
                  }
                  className="bg-red-500 text-white px-2 py-1 rounded-md"
                  disabled={item.quantity === 1}
                >
                  <FaMinus />
                </button>
                <span className="text-xl">{item.quantity}</span>
                <button
                  onClick={() =>
                    updateCartItemQuantity(item._id, item.quantity + 1)
                  }
                  className={`${
                    item.quantity >= item.stock
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500"
                  } text-white px-2 py-1 rounded-md`}
                  disabled={item.quantity >= item.stock}
                >
                  <FaPlus />
                </button>

                <button
                  onClick={() => handleRemoveFromCart(item._id)}
                  className="bg-red-500 text-white border px-2 py-1 rounded-md ml-4"
                >
                  Remove
                </button>
              </div>
              {item.quantity >= item.stock && (
                <span className="text-red-500 text-sm font-semibold">
                  Stock is finished
                </span>
              )}
            </div>
          </div>
        ))
      )}

      <div className="mt-4">
        <p className="font-semibold text-lg">Total: ${totalCost.toFixed(2)}</p>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold text-lg">Apply Coupon</h3>
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Enter Coupon Code"
          className="border p-2 mr-2"
        />
        <button
          onClick={verifyCoupon}
          className="bg-black text-white px-4 py-2 rounded-md"
        >
          Apply Coupon
        </button>
      </div>

      <p className="font-semibold text-lg">
        Discounted Total: ${displayDiscountedTotal.toFixed(2)}
      </p>

      <h3 className="text-lg font-semibold mb-2">Payment Methods</h3>
      <div className="mt-4 flex flex-col gap-y-2">
        <button
          onClick={() => handlePaymentMethodSelection("stripe")}
          className="bg-green-500 text-white px-4 py-2 rounded-md w-[300px]"
        >
          Pay with Stripe
        </button>
        <button
          onClick={() => handlePaymentMethodSelection("paypal")}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md w-[300px]"
        >
          Pay with PayPal
        </button>
      </div>
    </div>
  );
};

export default Cart;
