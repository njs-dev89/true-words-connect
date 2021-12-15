import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import { useFirebaseAuth } from "../../context/authContext";
import AuthUserDropdown from "./AuthUserDropdown";

function Navbar() {
  const { authUser, loading } = useFirebaseAuth();
  const router = useRouter();

  return (
    <div
      className={`${
        authUser && router.pathname !== "/"
          ? "bg-white shadow-sm"
          : "bg-transparent"
      } absolute w-full top-0`}
    >
      <div className="container">
        <div className="flex justify-between pt-1 items-center">
          <div className="flex items-center gap-4 sm:gap-16">
            <div
              className={`logo relative ${
                router.pathname === "/" ? "w-28 h-20" : "w-24 h-16"
              }`}
            >
              {" "}
              <Link href="/">
                <a>
                  {" "}
                  <Image src="/logo.svg" alt="" layout="fill" />
                </a>
              </Link>
            </div>
            <ul className="flex gap-2 sm:gap-6  text-sm sm:text-base">
              {authUser && (
                <>
                  <li className="font-medium">
                    <Link href="/providers">
                      <a>Find a Provider</a>
                    </Link>
                  </li>
                  <li className="font-medium">
                    <Link href="/about-us">
                      <a>About Us</a>
                    </Link>
                  </li>
                  <li className="font-medium">
                    <Link href="/providers">
                      <a>Contact Us</a>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="">
            {!authUser && (
              <>
                <Link href="/login">
                  <a className="btn btn-blue mr-2">Login</a>
                </Link>
                <Link href="/signup">
                  <a className="btn btn-yellow">Sign Up</a>
                </Link>
              </>
            )}

            {authUser && (
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  {" "}
                  <Image
                    src={
                      authUser.profile?.profile_pic ||
                      "/profile-placeholder.png"
                    }
                    layout="fill"
                    alt=""
                  />
                </div>

                {/* <p className="text-sm sm:text-base">
                    {authUser.profile?.username || "Guest user"}
                  </p>
                  <button onClick={() => setShowDropDown(!showDropdown)}>
                    <TiArrowSortedDown className="ml-0 sm:ml-1 text-xl" />
                  </button>
                  <AuthUserDropdown showDropdown={showDropdown} /> */}
                <AuthUserDropdown
                  username={authUser.profile?.username || "Guest user"}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
