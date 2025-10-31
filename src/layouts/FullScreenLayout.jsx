import React from "react";
import { Outlet } from "react-router-dom";

const FullScreenLayout = () => {
  return (
    <div className="w-full h-screen overflow-hidden">
      <Outlet />
    </div>
  );
};

export default FullScreenLayout;
