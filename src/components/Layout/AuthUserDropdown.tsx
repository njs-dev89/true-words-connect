import React, { useState } from "react";
import { useFirebaseAuth } from "../../context/authContext";
import Link from "next/link";

function AuthUserDropdown({ showDropdown }) {
  const { logOut, authUser } = useFirebaseAuth();
  return (
    <div className="relative">
      {showDropdown && (
        <div className="absolute top-4 right-0 bg-gray-50 w-36 rounded px-4 py-4 z-50">
          <ul>
            <li className="text-gray-500 py-2">
              <Link
                href={`${
                  authUser.role === "provider"
                    ? "/profile/overview"
                    : "/profile/orders"
                }`}
              >
                <a>Profile</a>
              </Link>
            </li>
            <li className="text-gray-500 py-2">
              <Link href="/profile/messages">
                <a>Messages</a>
              </Link>
            </li>
            <li className="text-gray-500 py-2">
              <Link
                href={`${
                  authUser.role === "provider"
                    ? "/profile/orders"
                    : "/profile/offers"
                }`}
              >
                {authUser.role === "provider" ? <a>Orders</a> : <a>Offers</a>}
              </Link>
            </li>
            <li className="text-gray-500 py-2">
              <Link href="/adminDashboard/applicants">
                <a>Applicants</a>
              </Link>
            </li>
            <li className="text-gray-500 py-2">
              <button onClick={logOut}>Logout</button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default AuthUserDropdown;
