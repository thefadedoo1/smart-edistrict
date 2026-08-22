import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

import { citizenMenu } from "../constants/menus";

export default function CitizenLayout() {
  return (
    <>
      <Navbar />

      <div className="flex">
        <Sidebar menu={citizenMenu} />

        <main className="flex-1 min-h-[calc(100vh-64px)] bg-slate-100 p-6">
          <Outlet />
        </main>
      </div>
    </>
  );
}