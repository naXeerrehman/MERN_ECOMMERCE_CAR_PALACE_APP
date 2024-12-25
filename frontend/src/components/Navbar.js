import React, { useState, useEffect } from "react";
import { FaBars, FaTimes, FaHome } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { IoCarSport } from "react-icons/io5";
import { Link } from "react-router-dom";
import Car_Palace from "../assets/Car_Palace.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Automatically close menu when screen width is large (>= 1024px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false); // Close menu on large screens
      }
    };
    window.addEventListener("resize", handleResize);
    // Cleanup the event listener when the component is unmounted
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setIsMenuOpen(false); // Close the menu on small screens when a link is clicked
    }
  };
  return (
    <>
      <div className="sticky top-0 z-10 flex justify-between items-center bg-black text-white px-4 py-2 h-[60px] mb-[15px]">
        <Link to="/">
          <img src={Car_Palace} alt="Car_logo" className="w-[80px] h-[60px]" />
        </Link>

        {/* Hamburger Icon for small screens */}
        <div
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden flex cursor-pointer py-2"
        >
          {isMenuOpen ? (
            <FaTimes className="text-2xl" />
          ) : (
            <FaBars className="text-2xl" />
          )}
        </div>

        {/* Menu Links */}
        <div
          className={`${
            isMenuOpen
              ? "flex flex-col items-end pr-[10px] gap-3 py-4 text-white absolute top-full left-0 w-full bg-black lg:hidden "
              : "hidden lg:flex lg:flex-row gap-x-6"
          }`}
        >
          <Link
            to="/"
            className="flex items-center gap-x-1 hover:font-bold"
            onClick={handleLinkClick}
          >
            <FaHome className="text-2xl" />
            Home
          </Link>
          <Link
            to="/AdminPanel"
            className="flex items-center gap-x-1 hover:font-bold"
            onClick={handleLinkClick}
          >
            <MdAdminPanelSettings className="text-2xl" />
            Admin Panel
          </Link>
          <Link
            to="/Shop"
            className="flex items-center gap-x-1 hover:font-bold"
            onClick={handleLinkClick}
          >
            <IoCarSport className="text-2xl" />
            Shop
          </Link>
          <Link
            to="/About"
            className="flex items-center gap-x-1 hover:font-bold"
            onClick={handleLinkClick}
          >
            <IoCarSport className="text-2xl" />
            About
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
