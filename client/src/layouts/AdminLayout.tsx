import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

import { adminMenu } from "../constants/menus";

export default function AdminLayout() {
  return (
    <>
      <Navbar />

      <div className="flex">
        <Sidebar menu={adminMenu} />

        <main className="flex-1 min-h-[calc(100vh-64px)] bg-slate-100 p-6">
          <Outlet />
        </main>
      </div>
    </>
  );
}