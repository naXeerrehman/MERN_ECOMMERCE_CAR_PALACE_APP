import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { downloadPDF } from "./PDF"; // Import the downloadPDF function
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";

const OrdersDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/orders/${orderId}`
        );
        const data = await response.json();

        if (data && data._id) {
          setOrder(data);
          setStatus(data.status); // Set initial status
        } else {
          setError("Invalid order data or order not found.");
        }
      } catch (error) {
        setError("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  useEffect(() => {
    console.log("Current status:", status); // Log the current status
  }, [status]);


    useEffect(() => {
      const token = localStorage.getItem("token"); // Check if token exists for logged-in status
  
      if (token) {
        setIsLoggedIn(true);
        try {
          const decodedToken = jwtDecode(token);
          console.log("Decoded Token:", decodedToken); // Log the decoded token
          setIsAdmin(decodedToken.isAdmin); // Assumes the token has 'isAdmin' property
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      } else {
        setIsLoggedIn(false);
      }
    }, []);

  const handleStatusChange = async (newStatus) => {
    console.log("Changing status to:", newStatus);

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        const updatedOrder = await response.json();
        console.log("Updated order:", updatedOrder);
        setOrder(updatedOrder); // Update the order in state
        setStatus(updatedOrder.status); // Update the status in state
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading)
    return (
      <>
        <h2 className="text-2xl font-bold mb-4 bg-black text-white text-center w-[300px] rounded-md ml-[100px] mt-[50px]">
          Order Details
        </h2>
        <div className="p-4 ml-[200px]">
          <FontAwesomeIcon
            icon={faCar}
            size="3x"
            className="animate-zoomInOut" // Apply the zoom-in/zoom-out animation
          />
          <div className="font-bold mr-5 mt-2">Loading...</div>
        </div>
      </>
    );

  if (error) return <div>{error}</div>;

  return (
    <div className="p-4 lg:w-[700px] mx-auto">
      <h2 className="text-2xl font-bold mb-4 bg-black text-white text-center w-[300px] mx-auto rounded-md">
        Order Details
      </h2>
      <div className="border border-gray-300 p-4">
        <p>
          <strong>Order ID:</strong> {order._id}
        </p>
        <p>
          <strong>Total Cost:</strong> ${order.totalCost}
        </p>
        <p>
          <strong>Payment Method:</strong> {order.paymentMethod}
        </p>
        <p>
          <strong>Date:</strong> {new Date(order.date).toLocaleString()}
        </p>
        <p>
          <strong>Shipping Address:</strong>{" "}
          {order.shippingAddress || "Not Provided"}
        </p>
        <p>
          <strong>Billing Address:</strong>{" "}
          {order.billingAddress || "Not Provided"}
        </p>
      </div>

      {/* Items Table */}
      <div className="mt-5">
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr className="bg-black text-white">
              <th className="border border-gray-300 px-4 py-2">#</th>
              <th className="border border-gray-300 px-4 py-2">Image</th>
              <th className="border border-gray-300 px-4 py-2">Model</th>
              <th className="border border-gray-300 px-4 py-2">Price</th>
              <th className="border border-gray-300 px-4 py-2">Quantity</th>
              <th className="border border-gray-300 px-4 py-2">Review</th>
            </tr>
          </thead>
          <tbody>
            {order.cartItems.map((item, index) => (
              <tr key={item._id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">
                  {index + 1}
                </td>
                <td className="border border-gray-300 py-2">
                  {item.imageUrls && item.imageUrls.length > 0 ? (
                    <img
                      src={item.imageUrls[0]}
                      alt={item.model}
                      className="w-[200px] h-[90px] mx-auto"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 flex items-center justify-center mx-auto">
                      No Image
                    </div>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.model}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ${item.price}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.quantity}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <Link
                    to={`/Reviews/${item._id}`} // Navigate to the comments page for the item
                    className="text-black font-semibold hover:underline"
                  >
                    Review
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isLoggedIn && isAdmin && (
        <div className="mt-4">
          <label htmlFor="status" className="font-bold">
            Order Status:
          </label>
          <select
            id="status"
            value={status} // Controlled by the status state
            onChange={(e) => {
              const newStatus = e.target.value;
              console.log("New status selected:", newStatus); // Debug
              handleStatusChange(newStatus);
            }}
            className="border border-gray-300 px-2 py-1 ml-2"
          >
            <option value="Placed">Placed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
        )}
        {/* Download PDF Button */}
        <button
          onClick={() => downloadPDF(order)} // Call the downloadPDF function when clicked
          className="mt-4 px-6 py-2 bg-blue-500 text-white font-bold rounded"
        >
          Download The Invoice
        </button>
      </div>
    </div>
  );
};

export default OrdersDetail;
