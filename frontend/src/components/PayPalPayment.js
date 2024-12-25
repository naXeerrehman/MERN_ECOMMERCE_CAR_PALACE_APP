import React from "react";

const PaypalPayment = ({ cartItems, discount, onPaymentError }) => {
  const makePaypalPayment = async () => {
    try {
      console.log("Sending cartItems and discount:", { cartItems, discount });

      // Send the necessary data (cartItems, discount) to the backend
      const paymentResponse = await fetch(
        "http://localhost:5000/api/paypal/create-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cartItems,
            discount, // Send discount value to backend
          }),
        }
      );

      if (!paymentResponse.ok) {
        throw new Error("Failed to create PayPal order");
      }

      const { approvalUrl, paypalOrderId } = await paymentResponse.json();

      // Redirect user to PayPal's checkout page
      window.location.href = approvalUrl;
    } catch (error) {
      onPaymentError("Error initiating PayPal payment.");
    }
  };

  return (
    <div>
      <button
        onClick={makePaypalPayment}
        className="bg-yellow-500 ml-[250px] text-white py-2 px-4 rounded-md mb-3"
      >
        Pay with PayPal
      </button>
    </div>
  );
};

export default PaypalPayment;
