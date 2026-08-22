import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

import { officerMenu } from "../constants/menus";

export default function OfficerLayout() {
  return (
    <>
      <Navbar />

      <div className="flex">
        <Sidebar menu={officerMenu} />

        <main className="flex-1 min-h-[calc(100vh-64px)] bg-slate-100 p-6">
          <Outlet />
        </main>
      </div>
    </>
  );
}