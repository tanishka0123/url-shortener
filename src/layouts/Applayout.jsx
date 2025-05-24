import Header from "@/components/Header";
import React from "react";
import { Outlet } from "react-router-dom";

function Applayout() {
  return (
    <div className="ml-20 mr-20">
      <main className="min-h-screen">
        <Header></Header>
        <Outlet />
      </main>
      <div className="p-10 text-center bg-gray-800 mt-10"> Made with ❤️ by Tanishka</div>
    </div>
  );
}

export default Applayout;
