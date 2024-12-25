import React from "react";
import { loadStripe } from "@stripe/stripe-js";

const StripePayment = ({ cartItems, discount, onPaymentError }) => {
  const stripePromise = loadStripe(
    "pk_test_51QFvdlGArWAY6PqOZC3o0o88m1teslqe2894xNACSWdQoH7Omjjg7Rge394hHw0GiYdzMl8SefhfRjUZDT13OWUH00Qr74tUVE"
  );

  const makeStripePayment = async () => {
    try {
      // Initiate Stripe payment
      const paymentResponse = await fetch(
        "http://localhost:5000/api/stripe/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cartItems, discount }),
        }
      );

      const { sessionId } = await paymentResponse.json();

      // Redirect to Stripe's checkout page
      const stripe = await stripePromise;
      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        onPaymentError("Stripe payment failed.");
      }
    } catch (error) {
      onPaymentError("Error initiating Stripe payment.");
    }
  };

  return (
    <div>
      <button
        onClick={makeStripePayment}
        className="bg-green-500 text-white py-2 px-4 rounded-md ml-[250px] mb-3"
      >
        Pay with Stripe
      </button>
    </div>
  );
};

export default StripePayment;
