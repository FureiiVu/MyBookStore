import { Outlet } from "react-router-dom";

import Topbar from "@/components/Topbar";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Topbar />

      <div className="flex-1 bg-[#e9ecef]">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
