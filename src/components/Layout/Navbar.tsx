import React from "react";
import Link from "next/link";
import Image from "next/image";

import { useFirebaseAuth } from "../../context/authContext";
import AuthUserDropdown from "./AuthUserDropdown";

function Navbar() {
  const { authUser, loading } = useFirebaseAuth();
  return (
    <div className="bg-transparent absolute w-full top-0">
      <div className="container">
        <div className="flex justify-between pt-1 items-center">
          <div className="logo relative w-24 h-16">
            {" "}
            <Link href="/">
              <a>
                {" "}
                <Image src="/logo.svg" alt="" layout="fill" />
              </a>
            </Link>
          </div>
          <Link href="/protectedPage">
            <a>Protected page</a>
          </Link>
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
              <div className="flex items-end gap-2">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  {" "}
                  <Image src="/search-image.jpg" layout="fill" alt="" />
                </div>
                <p>John Doe</p>
                <AuthUserDropdown />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
