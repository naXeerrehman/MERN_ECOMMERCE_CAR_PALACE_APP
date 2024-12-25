import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import Confetti from "react-confetti";

const StripePaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("");
  const [order, setOrder] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (sessionId) {
      // Save order after successful payment
      const saveOrder = async () => {
        try {
          const response = await fetch(
            "http://localhost:5000/api/stripe/save-order",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sessionId }),
            }
          );

          const result = await response.json();
          if (response.ok) {
            setOrder(result.order);
            setShowConfetti(true); // Trigger confetti on success
            setMessage("success");
          } else {
            setMessage("error");
          }
        } catch (error) {
          setMessage("error");
        }
      };

      saveOrder();
    }
  }, [searchParams]);

  // Redirect to the home page after 4 seconds if the payment was successful or if there's an error
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        navigate("/"); // Redirect to home page
      }, 4000);

      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, [message, navigate]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {/* Confetti effect */}
      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}

      {/* Success or Error Message */}
      {message === "success" ? (
        <div>
          <h1
            style={{ color: "green", fontSize: "2rem", marginBottom: "10px" }}
          >
            Payment Successful!
          </h1>
          <p style={{ fontSize: "1.2rem" }}>
            Your order has been successfully placed.
          </p>
          <br></br>
          Check for{" "}
          <Link to="/OrdersHistory" className="font-semibold">
            Order History for more details
          </Link>
        </div>
      ) : message === "error" ? (
        <div>
          <h1 style={{ color: "red", fontSize: "2rem", marginBottom: "10px" }}>
            Error Processing Payment
          </h1>
          <p style={{ fontSize: "1.2rem" }}>
            There was an issue processing your order. Please try again later.
          </p>
        </div>
      ) : (
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
          Processing your payment...
        </h1>
      )}
    </div>
  );
};

export default StripePaymentSuccess;
