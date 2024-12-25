import React from "react";
import { Link } from "react-router-dom";
const Cancel = () => {
  return (
    <div className="text-center mt-5">
      <h4 className="font-bold">Oops! Your payment has been cancelled.</h4>
      <p className="font-bold">
        We appreciate your business! If you have any questions, <br />
        please email us at
        <a href="mailto:orders@example.com"> naxeerrehman@gmail.com.com</a>.
      </p>
      <Link to="/" className="font-bold border-b border-black">
        {" "}
        Go to Home page
      </Link>
    </div>
  );
};
export default Cancel;
