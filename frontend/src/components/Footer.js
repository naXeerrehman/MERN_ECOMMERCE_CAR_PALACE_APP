import React from "react";
import Car_Palace from "../assets/Car_Palace.png";
const Footer = () => {
  const date = new Date();
  const year = date.getFullYear();
  return (
    <>
      <div className="justify-between mt-5 bg-black text-white px-5 grid grid-cols-4 lg:grid-cols-5 py-4">
        <h1 className="text-2xl font-semibold
        relative right-[23px]
        ">
          <img src={Car_Palace} alt="Car_logo" className="w-[80px] h-[60px]" />
        </h1>
        <div>
          <h1 className="font-bold mb-1">
            <span className="border-b-2">Fea</span>tures
          </h1>
          <ul className="flex flex-col gap-y-1">
            <a href="/">Brands Links</a>
            <a href="/">Analytics</a>
            <a href="/">Affiliates</a>
            <a href="/">Blog</a>
          </ul>
        </div>
        <div>
          <h1 className="font-bold mb-1">
            <span className="border-b-2">Res</span>ources
          </h1>
          <ul className="flex flex-col gap-y-1">
            <a href="/">Latest Products</a>
            <a href="/">Developer</a>
            <a href="/">Support</a>
            <a href="/">Docs</a>
          </ul>
        </div>
        <div className="xs:ml-[20px]">
          <h1 className="font-bold mb-1">
            <span className="border-b-2">com</span>pany
          </h1>
          <ul className="flex flex-col gap-y-1">
            <a href="/">About</a>
            <a href="/">Our Team</a>
            <a href="/">Career</a>
            <a href="/">Contact</a>
          </ul>
        </div>
        <div className="mt-4  
        xs:ml-[140px]
        sm:ml-[165px]
        md:ml-[360px]
        lg:ml-0 lg:mt-0
        ">
          <h1 className="font-bold mb-1">
            <span className="border-b-2">Par</span>tner
          </h1>
          <ul className="flex flex-col gap-y-1">
            <a href="/">About</a>
            <a href="/">Our Community</a>
            <a href="/">Projects</a>
            <a href="/">Contact</a>
          </ul>
        </div>
      </div>
      <div className="bg-gray-800 text-white text-center py-4">
        &copy; {year} All rights reserved
      </div>
    </>
  );
};

export default Footer;
