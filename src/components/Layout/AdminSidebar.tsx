import React from "react";
import Image from "next/image";
import Link from "next/link";

function AdminSidebar() {
  return (
    <div className="col-span-1 bg-white py-6 shadow-md rounded-xl">
      <div className="flex flex-col items-center px-4 pb-4 border-b">
        <div className="w-32 h-32 relative ">
          <Image src="/logo.svg" alt="" layout="fill" />
        </div>
        <h3 className="font-bold text-lg mt-4 mb-2">True Words Connect</h3>
      </div>
      <div className="px-4 mt-4">
        <ul className="flex flex-col">
          <li>
            <Link href="/adminDashboard/applicants">
              <a className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
                <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                  <i className="bx bx-home"></i>
                </span>
                <span className="text-sm font-medium">Applicants</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/adminDashboard/translators">
              <a className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
                <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                  <i className="bx bx-music"></i>
                </span>
                <span className="text-sm font-medium">Translators</span>
              </a>
            </Link>
          </li>
          <li>
            <a
              href="#"
              className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
            >
              <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                <i className="bx bx-drink"></i>
              </span>
              <span className="text-sm font-medium">Clients</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default AdminSidebar;
