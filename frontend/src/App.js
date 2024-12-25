import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.js";
import UploadVehicle from "./components/UploadVehicle";
import EditVehicle from "./components/EditVehicle";
import CartPage from "./components/Cart";
import StripePaymentSuccess from "./components/StripePaymentSuccess";
import Cancel from "./components/Cancel";
import VehicleDetail from "./components/VehicleDetail";
import Wishlist from "./components/Wishlist";
import OrdersHistory from "./components/OrdersHistory";
import CategoryManager from "./components/CategoryManager";
import AdminPanel from "./components/AdminPanel";
import AllProducts from "./components/AllProducts";
import OrdersDetail from "./components/OrdersDetail";
import CouponManager from "./components/CouponManager";
import Reviews from "./components/Reviews";
import StripePayment from "./components/StripePayment";
import PayPalPayment from "./components/PayPalPayment";
import AdminPanelHome from "./components/AdminPanelHome";
import CheckoutDetails from "./components/CheckoutDetails";
import PaypalPaymentSuccess from "./components/PaypalPaymentSuccess";
import Shop from "./components/Shop";
import Home from "./components/Home";
import VehicleCarousel from "./components/VehicleCarousel.js";
import Features from "./components/Features.js";
import Banner from "./components/Banner.js";
import CTA from "./components/CTA.js";
import About from "./components/About.js";
import IconManagement from "./components/IconManagement.js";
import TextEditor from "./components/TextEditor.js";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/UploadVehicle" element={<UploadVehicle />} />
        <Route path="/EditVehicle/:vehicleId" element={<EditVehicle />} />
        <Route path="/cart" element={<CartPage />} />
        <Route
          path="/StripePaymentSuccess"
          element={<StripePaymentSuccess />}
        />
        <Route path="/Cancel" element={<Cancel />} />
        <Route path="/PayPalPayment" element={<PayPalPayment />} />
        <Route path="/VehicleDetail/:id" element={<VehicleDetail />} />
        <Route path="/Wishlist" element={<Wishlist />} />
        <Route path="/OrdersHistory" element={<OrdersHistory />} />
        <Route path="/CategoryManager" element={<CategoryManager />} />
        <Route path="/AdminPanel" element={<AdminPanel />} />
        <Route path="/AllProducts" element={<AllProducts />} />
        <Route path="/OrdersDetail/:orderId" element={<OrdersDetail />} />
        <Route path="/CouponManager" element={<CouponManager />} />
        <Route path="/Reviews/:id" element={<Reviews />} />
        <Route path="/StripePayment" element={<StripePayment />} />
        <Route path="/PayPalPayment" element={<PayPalPayment />} />
        <Route path="/AdminPanelHome" element={<AdminPanelHome />} />
        <Route path="/CheckoutDetails" element={<CheckoutDetails />} />
        <Route
          path="/PaypalPaymentSuccess"
          element={<PaypalPaymentSuccess />}
        />
        <Route path="/Shop" element={<Shop />} />
        {/* <Route path="/HomePage" element={<Home />} /> */}
        {/* <Route path="/VehicleCarousel" element={<VehicleCarousel />} /> */}
        {/* <Route path="/Features" element={<Features />} /> */}
        {/* <Route path="/Banner" element={<Banner />} /> */}
        {/* <Route path="/CTA" element={<CTA />} /> */}
        <Route path="/About" element={<About />} />
        <Route path="/IconManagement" element={<IconManagement />} />
        <Route path="/TextEditor" element={<TextEditor />} />
      </Routes>
    </div>
  );
};

export default App;
