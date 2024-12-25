import React from "react";
import Confetti from "react-confetti";
import { Link } from "react-router-dom";
const PaypalPaypalSuccess = () => {
  // Get window dimensions for confetti rendering
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {/* Confetti effect */}
      <Confetti width={windowWidth} height={windowHeight} />

      {/* Success Message */}
      <h1 style={{ color: "green", fontSize: "2rem", marginBottom: "10px" }}>
        🎉 Your Order is Successfully Placed! 🎉
      </h1>
      <p style={{ fontSize: "1.2rem" }}>
        Check your <Link to="/OrdersHistory">Order History</Link> for more
        information.
      </p>
    </div>
  );
};

export default PaypalPaypalSuccess;
