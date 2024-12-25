import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserTie } from "react-icons/fa6";
import AdminPanelHome from "./AdminPanelHome"; // Import Home component
import UploadVehicle from "./UploadVehicle"; // Import other components
import OrdersHistory from "./OrdersHistory";
import CategoryManager from "./CategoryManager";
import AllProducts from "./AllProducts";
import CouponManager from "./CouponManager";
import IconManagement from "./IconManagement";

const AdminPanel = () => {
  const [activeComponent, setActiveComponent] = useState("Home");

  // Map for components to render dynamically
  const componentsMap = {
    Home: <AdminPanelHome />,
    UploadVehicle: <UploadVehicle />,
    OrdersHistory: <OrdersHistory />,
    CategoryManager: <CategoryManager />,
    AllProducts: <AllProducts />,
    CouponManager: <CouponManager />,
    IconManagement: <IconManagement />,
  };

  return (
    <div className="pt-[15px] pb-[50px]">
      <h1 className="text-4xl bg-black text-white w-[400px] text-center mx-[100px] lg:mx-[600px] rounded-md">
        Admin Panel
      </h1>
      <div className="flex flex-col lg:flex-row gap-x-[20px] mx-5">
        {/* Left Section */}
        <div className="flex flex-col">
          <div className="border border-black mt-4 h-[200px] flex flex-col items-center bg-black w-[340px] mx-auto rounded-md">
            <div className="mt-[20px]">
              <FaUserTie className="text-9xl text-white" />
              <h1 className="text-center text-2xl text-white">Admin</h1>
            </div>
          </div>
          <div className="flex flex-col mx-auto">
            {/* Navigation Links */}
            <button
              onClick={() => setActiveComponent("Home")}
              className={`border border-black mt-1 px-2 w-[340px] py-2 ${
                activeComponent === "Home"
                  ? "border-r-4 border-black font-semibold"
                  : ""
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveComponent("UploadVehicle")}
              className={`border border-black mt-1 px-2 w-[340px] py-2 ${
                activeComponent === "UploadVehicle"
                  ? "border-r-4 border-black font-semibold"
                  : ""
              }`}
            >
              Upload Vehicle
            </button>
            <button
              onClick={() => setActiveComponent("OrdersHistory")}
              className={`border border-black mt-1 px-2 w-[340px] py-2 ${
                activeComponent === "OrdersHistory"
                  ? "border-r-4 border-black font-semibold"
                  : ""
              }`}
            >
              Orders History
            </button>
            <button
              onClick={() => setActiveComponent("CategoryManager")}
              className={`border border-black mt-1 px-2 w-[340px] py-2 ${
                activeComponent === "CategoryManager"
                  ? "border-r-4 border-black font-semibold"
                  : ""
              }`}
            >
              Category Manager
            </button>
            <button
              onClick={() => setActiveComponent("AllProducts")}
              className={`border border-black mt-1 px-2 w-[340px] py-2 ${
                activeComponent === "AllProducts"
                  ? "border-r-4 border-black font-semibold"
                  : ""
              }`}
            >
              All Products
            </button>
            <button
              onClick={() => setActiveComponent("CouponManager")}
              className={`border border-black mt-1 px-2 w-[340px] py-2 ${
                activeComponent === "CouponManager"
                  ? "border-r-4 border-black font-semibold"
                  : ""
              }`}
            >
              Coupon Manager
            </button>
            <button
              onClick={() => setActiveComponent("IconManagement")}
              className={`border border-black mt-1 px-2 w-[340px] py-2 ${
                activeComponent === "IconManagement"
                  ? "border-r-4 border-black font-semibold"
                  : ""
              }`}
            >
              Icon Management{" "}
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1">{componentsMap[activeComponent]}</div>
      </div>
    </div>
  );
};

export default AdminPanel;
