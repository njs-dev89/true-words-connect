import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { useFirebaseAuth } from "../../context/authContext";
import AuthUserDropdown from "./AuthUserDropdown";
import { TiArrowSortedDown } from "react-icons/ti";

function Navbar() {
  const { authUser, loading } = useFirebaseAuth();
  const [showDropdown, setShowDropDown] = useState(false);

  return (
    <div
      className={`${
        authUser ? "bg-white shadow-sm" : "bg-transparent"
      } absolute w-full top-0`}
    >
      <div className="container">
        <div className="flex justify-between pt-1 items-center">
          <div className="flex items-center gap-4 sm:gap-16">
            <div className="logo relative w-16 h-12 sm:w-24 sm:h-16">
              {" "}
              <Link href="/">
                <a>
                  {" "}
                  <Image src="/logo.svg" alt="" layout="fill" />
                </a>
              </Link>
            </div>
            <ul className="flex gap-2 sm:gap-6 text-blue text-sm sm:text-base">
              {authUser && (
                <>
                  <li className="font-medium">
                    <Link href="/translators">
                      <a>Providers</a>
                    </Link>
                  </li>
                  <li className="font-medium">
                    <Link href="/translators">
                      <a>How it works</a>
                    </Link>
                  </li>
                  <li className="font-medium">
                    <Link href="/translators">
                      <a>Terms of Services</a>
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
                  <a className="btn btn-yellow">Signup</a>
                </Link>
              </>
            )}
            {authUser && (
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  {" "}
                  <Image
                    src={authUser.profile.profile_pic}
                    layout="fill"
                    alt=""
                  />
                </div>
                <div className="flex items-end">
                  <p className="text-sm sm:text-base">
                    {authUser.profile.username}
                  </p>
                  <button onClick={() => setShowDropDown(!showDropdown)}>
                    <TiArrowSortedDown className="ml-0 sm:ml-1 text-xl" />
                  </button>
                  <AuthUserDropdown showDropdown={showDropdown} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
