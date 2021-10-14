import React from "react";
import Navbar from "./Navbar";
import { useRouter } from "next/router";
import AdminSidebar from "./AdminSidebar";

function Layout({ children }) {
  const router = useRouter();
  return (
    <div>
      <Navbar />
      {router.pathname.includes("adminDashboard") ? (
        <>
          <div className="bg-blue-50 pb-16 pt-32 min-h-screen">
            <div className="container">
              <div className="grid grid-cols-4 gap-4">
                <AdminSidebar />
                {children}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>{children}</>
      )}
    </div>
  );
}

export default Layout;
