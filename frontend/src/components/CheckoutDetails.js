import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PayPalPayment from "../components/PayPalPayment";
import StripePayment from "../components/StripePayment";

const CheckoutDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { paymentMethod, discount: passedDiscount } = location.state || {};
  const [discount, setDiscount] = useState(passedDiscount || 0); // Use passed discount or default to 0

  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });
  const [billingAddress, setBillingAddress] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cartItems")) || []
  );
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    const cartTotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    setTotalCost(cartTotal);
  }, [cartItems]);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingAddress((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onPaymentError = (error) => {
    console.error("Payment Error:", error);
  };

  const handleTransactionSuccess = async (transactionDetails) => {
    try {
      const { paypalOrderId, status } = transactionDetails;

      // Capture and save order after address is saved
      const captureResponse = await fetch(
        "http://localhost:5000/api/order/capture-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transactionDetails,
            paypalOrderId,
            cartItems,
            discount,
            totalCost: totalCost - (totalCost * discount) / 100,
          }),
        }
      );

      const captureResult = await captureResponse.json();

      if (captureResponse.ok) {
        const saveOrderResponse = await fetch(
          "http://localhost:5000/api/order/save-order",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              transactionDetails,
              cartItems,
              discount,
              paymentMethod,
              totalCost,
              shippingAddress,
              billingAddress,
            }),
          }
        );

        const saveOrderResult = await saveOrderResponse.json();

        if (saveOrderResponse.ok) {
          navigate("/order-success", {
            state: { transactionDetails, orderDetails: saveOrderResult.order },
          });
        } else {
          console.error("Order saving failed:", saveOrderResult.error);
        }
      } else {
        console.error("Payment capture failed:", captureResult.error);
      }
    } catch (error) {
      console.error("Error during transaction:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!shippingAddress.name || !billingAddress) {
      return; // Don't allow submission if addresses are incomplete
    }
    // Redirect to payment page immediately after validation
    navigate("/checkout-payment", {
      state: { paymentMethod, discount, cartItems, totalCost, shippingAddress, billingAddress },
    });
  };

  return (
    <div className="mt-5 w-[700px] mx-auto">
      <h2 className="text-3xl font-semibold text-center bg-black text-white w-[450px] mx-auto py-2 rounded-md">
        Shipping & Billing Address
      </h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4 text-center">
          <h3 className="text-xl">
            Payment Method: {paymentMethod === "paypal" ? "PayPal" : "Stripe"}
          </h3>
        </div>

        <div className="mb-4 ml-[150px]">
          <h3 className="text-lg font-semibold mb-2 bg-black text-white w-[155px] ml-2 rounded-md px-1">
            Shipping Address
          </h3>
          {["name", "address", "city", "state", "zip"].map((field) => (
            <div key={field} className="mb-2">
              <label htmlFor={field} className="block mb-1 capitalize ml-3">
                {field}
              </label>
              <input
                type="text"
                id={field}
                name={field}
                value={shippingAddress[field]}
                onChange={handleShippingChange}
                className="p-2 border border-black rounded w-[300px] ml-3"
                required
              />
            </div>
          ))}
        </div>

        <div className="mb-4 ml-[150px]">
          <h3 className="text-lg font-semibold mb-2 bg-black text-white w-[155px] ml-2 rounded-md px-1">
            Billing Address
          </h3>
          {["name", "address", "city", "state", "zip"].map((field) => (
            <div key={field} className="mb-2">
              <label htmlFor={field} className="block mb-1 capitalize ml-3">
                {field}
              </label>
              <input
                type="text"
                id={field}
                name={field}
                value={billingAddress[field]}
                onChange={handleBillingChange}
                className="p-2 border border-black rounded w-[300px] ml-3"
                required
              />
            </div>
          ))}
        </div>

        {/* Payment Method Components */}
        <div className="mt-4 flex flex-col gap-y-2">
          {paymentMethod === "stripe" ? (
            <StripePayment
              cartItems={cartItems}
              discount={discount}
              totalCost={totalCost}
              onPaymentError={onPaymentError}
              onTransactionSuccess={handleTransactionSuccess}
            />
          ) : (
            <PayPalPayment
              cartItems={cartItems}
              discount={discount}
              totalCost={totalCost}
              onPaymentError={onPaymentError}
              onTransactionSuccess={handleTransactionSuccess}
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default CheckoutDetails;
