import React, { Fragment, useState } from "react";
import { useFirebaseAuth } from "../../context/authContext";
import Link from "next/link";
import { useAgora } from "../../context/agoraContextNoSsr";
import { Menu, Transition } from "@headlessui/react";
import { TiArrowSortedDown } from "react-icons/ti";

// function AuthUserDropdown({ showDropdown }) {
//   const { logOut, authUser } = useFirebaseAuth();
//   const { logOutFromAgora } = useAgora();
//   return (
//     <div className="relative">
//       {showDropdown && (
//         <div className="absolute top-4 right-0 bg-gray-50 w-36 rounded px-4 py-4 z-50">
//           <ul>
//             <li className="text-gray-500 py-2">
//               <Link
//                 href={`${
//                   authUser.role === "provider"
//                     ? "/profile/overview"
//                     : "/profile/orders"
//                 }`}
//               >
//                 <a>Profile</a>
//               </Link>
//             </li>
//             <li className="text-gray-500 py-2">
//               <Link href="/profile/messages">
//                 <a>Messages</a>
//               </Link>
//             </li>
//             <li className="text-gray-500 py-2">
//               <Link
//                 href={`${
//                   authUser.role === "provider"
//                     ? "/profile/orders"
//                     : "/profile/offers"
//                 }`}
//               >
//                 {authUser.role === "provider" ? <a>Orders</a> : <a>Offers</a>}
//               </Link>
//             </li>
//             <li className="text-gray-500 py-2">
//               <Link href="/adminDashboard/applicants">
//                 <a>Applicants</a>
//               </Link>
//             </li>
//             {authUser.role === "client" && (
//               <li className="text-gray-500 py-2">
//                 <Link href="/provider-onboarding">
//                   <a>Become a Provider</a>
//                 </Link>
//               </li>
//             )}
//             <li className="text-gray-500 py-2">
//               <button
//                 onClick={() => {
//                   logOut();
//                   logOutFromAgora();
//                 }}
//               >
//                 Logout
//               </button>
//             </li>
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

function AuthUserDropdown({ username }) {
  const { logOut, authUser } = useFirebaseAuth();
  const { logOutFromAgora } = useAgora();
  return (
    <div className="">
      <Menu as="div" className="relative text-left">
        <div>
          <Menu.Button className="inline-flex justify-center w-full px-2 py-2 text-sm font-medium  rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            {username}
            <TiArrowSortedDown className="ml-0 sm:ml-1 text-xl" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 w-56 z-50 mt-2 origin-top-right bg-gray-50 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="flex flex-col px-4 py-4">
                <Menu.Item>
                  <Link
                    href={`${
                      authUser.role === "provider"
                        ? "/profile/overview"
                        : "/profile/orders"
                    }`}
                  >
                    <a className="py-1">Profile</a>
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <Link href="/profile/messages">
                    <a className="py-1">Messages</a>
                  </Link>
                </Menu.Item>

                <Menu.Item>
                  <Link
                    href={`${
                      authUser.role === "provider"
                        ? "/profile/orders"
                        : "/profile/offers"
                    }`}
                  >
                    {authUser.role === "provider" ? (
                      <a className="py-1">Orders</a>
                    ) : (
                      <a className="py-1">Offers</a>
                    )}
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <Link href="/adminDashboard/applicants">
                    <a className="py-1">Applicants</a>
                  </Link>
                </Menu.Item>
                {authUser.role === "client" && (
                  <Menu.Item>
                    <Link href="/provider-onboarding">
                      <a className="py-1">Become a Provider</a>
                    </Link>
                  </Menu.Item>
                )}
                <Menu.Item>
                  <a
                    className="py-1 cursor-pointer"
                    onClick={() => {
                      logOut();
                      logOutFromAgora();
                    }}
                  >
                    Logout
                  </a>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </div>
      </Menu>
    </div>
  );
}

export default AuthUserDropdown;
