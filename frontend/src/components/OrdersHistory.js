import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

const OrdersHistory = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const navigate = useNavigate();
  const [refreshOrders, setRefreshOrders] = useState(false);
  const [showAll, setShowAll] = useState(false); // State to manage showing all rows

  useEffect(() => {
    fetchOrders();
  }, [refreshOrders]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/orders");
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      console.log("Fetched orders:", data); // Log the fetched orders to check structure
      setOrders(data);
      setIsLoading(false); // Set loading to false when data is fetched
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setIsLoading(false); // Set loading to false if there's an error
    }
  };

  const handleRowClick = (orderId) => {
    navigate(`/OrdersDetail/${orderId}`);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      setRefreshOrders((prev) => !prev);
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  // Helper function to calculate total quantity of each product
  const calculateQuantities = (cartItems) => {
    return cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  };

  return (
    <div className="p-4 lg:w-[800px] mx-auto">
      {isLoading ? (
        <div className="flex flex-col justify-center items-center mt-5">
          <FontAwesomeIcon
            icon={faCar}
            size="3x"
            className="animate-zoomInOut" // Apply the zoom-in/zoom-out animation
          />
          <div className="font-bold ml-2 mt-2">Loading...</div>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4 bg-black text-white text-center rounded-md py-2">
            Order History
          </h2>
          <h1 className="text-center mb-1 font-bold">Click on the row to view the order details.</h1>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-black text-white">
                <th className="border border-gray-300 px-4 py-2">#</th>
                <th className="border border-gray-300 px-4 py-2">Order ID</th>
                <th className="border border-gray-300 px-4 py-2">Quantity</th>
                <th className="border border-gray-300 px-4 py-2">Total Cost</th>
                <th className="border border-gray-300 px-4 py-2">
                  Payment Method
                </th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                (showAll ? orders : orders.slice(0, 5)).map((order, index) => {
                  const quantities = calculateQuantities(order.cartItems);
                  return (
                    <tr
                      key={order._id}
                      className="text-center cursor-pointer"
                      onClick={() => handleRowClick(order._id)}
                    >
                      <td className="border border-gray-300 px-4 py-2">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {order._id}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {calculateQuantities(order.cartItems)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        ${order.amount}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {order.paymentMethod === "Stripe"
                          ? "Stripe"
                          : order.paymentMethod}
                      </td>

                      <td className="border border-gray-300 px-4 py-2">
                        {order.date
                          ? moment(order.date).format("MM/DD/YYYY hh:mm A")
                          : "Invalid Date"}
                      </td>

                      <td className="border border-gray-300 px-4 py-2 font-semibold">
                        {order.status}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No orders available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="text-center mt-4">
            {!showAll && orders.length > 6 && (
              <button
                onClick={() => setShowAll(true)}
                className="bg-black text-white px-4 py-2 rounded"
              >
                See More...
              </button>
            )}
            {showAll && (
              <button
                onClick={() => setShowAll(false)}
                className="bg-black text-white px-4 py-2 rounded"
              >
                Show Less...
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersHistory;
