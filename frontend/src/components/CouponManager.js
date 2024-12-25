import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar } from "@fortawesome/free-solid-svg-icons";

const CouponManager = () => {
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({
    name: "",
    discount: "",
    expirationDate: "",
  });
  const [editingCoupon, setEditingCoupon] = useState(null); // For editing
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    fetchCoupons();
  }, []);


  const handleAddCoupon = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCoupon),
      });
      const createdCoupon = await response.json();
      setCoupons([...coupons, { ...createdCoupon, expired: false }]);
      setNewCoupon({ name: "", discount: "", expirationDate: "" });
    } catch (error) {
      console.error("Failed to add coupon", error);
    }
  };

  const fetchCoupons = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/coupons");
      const data = await response.json();
      const updatedCoupons = data.map((coupon) => ({
        ...coupon,
        expired: new Date(coupon.expirationDate) < new Date(),
      }));
      setCoupons(updatedCoupons);

      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error("Failed to fetch coupons", error);
      setLoading(false); // Set loading to false in case of error
    }
  };

  const handleEditCoupon = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/coupons/${editingCoupon._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingCoupon),
        }
      );
      const updatedCoupon = await response.json();
      setCoupons((prevCoupons) =>
        prevCoupons.map((coupon) =>coupon._id ===updatedCoupon._id ? updatedCoupon : coupon
        )
      );
      setEditingCoupon(null); // Close edit mode
    } catch (error) {
      console.error("Failed to edit coupon", error);
    }
  };

  const handleDeleteCoupon = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/coupons/${id}`, {
        method: "DELETE",
      });
      setCoupons((prevCoupons) => prevCoupons.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Failed to delete coupon", error);
    }
  };

  return (
    <div className="p-4 w-[600px] lg:w-[650px] mx-auto border border-black mt-[20px]">
      <h2 className="text-xl font-semibold mb-4">Manage Coupons</h2>

      {loading ? (
        <div className="flex flex-col justify-center items-center mt-5">
          <FontAwesomeIcon
            icon={faCar}
            size="3x"
            className="animate-zoomInOut" // Apply the zoom-in/zoom-out animation
          />
          <div className="font-bold ml-2 mt-2">Loading...</div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <div className="flex flex-col mb-2">
              <label htmlFor="coupon-name" className="font-medium mb-1">
                Coupon Name:
              </label>
              <input
                id="coupon-name"
                type="text"
                placeholder="Enter coupon name"
                value={editingCoupon ? editingCoupon.name : newCoupon.name}
                onChange={(e) =>
                  editingCoupon
                    ? setEditingCoupon({
                        ...editingCoupon,
                        name: e.target.value,
                      })
                    : setNewCoupon({ ...newCoupon, name: e.target.value })
                }
                className="border p-2"
              />
            </div>

            <div className="flex flex-col mb-2">
              <label htmlFor="coupon-discount" className="font-medium mb-1">
                Discount (%):
              </label>
              <input
                id="coupon-discount"
                type="number"
                placeholder="Enter discount percentage"
                value={
                  editingCoupon ? editingCoupon.discount : newCoupon.discount
                }
                onChange={(e) =>
                  editingCoupon
                    ? setEditingCoupon({
                        ...editingCoupon,
                        discount: e.target.value,
                      })
                    : setNewCoupon({ ...newCoupon, discount: e.target.value })
                }
                className="border p-2"
              />
            </div>

            <div className="flex flex-col mb-2">
              <label htmlFor="coupon-expiration" className="font-medium mb-1">
                Expiration Date:
              </label>
              <input
                id="coupon-expiration"
                type="date"
                value={
                  editingCoupon
                    ? editingCoupon.expirationDate
                    : newCoupon.expirationDate
                }
                onChange={(e) =>
                  editingCoupon
                    ? setEditingCoupon({
                        ...editingCoupon,
                        expirationDate: e.target.value,
                      })
                    : setNewCoupon({
                        ...newCoupon,
                        expirationDate: e.target.value,
                      })
                }
                className="border p-2"
              />
            </div>

            <button
              onClick={editingCoupon ? handleEditCoupon : handleAddCoupon}
              className="bg-black text-white px-4 py-2 rounded-md"
            >
              {editingCoupon ? "Update Coupon" : "Add Coupon"}
            </button>
            {editingCoupon && (
              <button
                onClick={() => setEditingCoupon(null)}
                className="bg-red-500 text-white px-4 py-2 rounded-md ml-2"
              >
                Cancel
              </button>
            )}
          </div>

          <table className="border-collapse border border-gray-200 w-full text-left">
            <thead>
              <tr>
                <th className="border p-2">S/N</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Discount</th>
                <th className="border p-2">Created At</th>
                <th className="border p-2">Expiration Date</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon, index) => (
                <tr key={coupon._id}>
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{coupon.name}</td>
                  <td className="border p-2">{coupon.discount}%</td>
                  <td className="border p-2">
                    {new Date(coupon.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border p-2">
                    {new Date(coupon.expirationDate).toLocaleDateString()}
                  </td>
                  <td
                    className={`border p-2 ${
                      coupon.expired ? "text-red-500" : "text-green-900"
                    }`}
                  >
                    {coupon.expired ? "Expired" : "Active"}
                  </td>
                  <td className="border p-2 flex flex-col lg:flex-row gap-y-1">
                    <button
                      onClick={() => setEditingCoupon(coupon)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded-md mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCoupon(coupon._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default CouponManager;
