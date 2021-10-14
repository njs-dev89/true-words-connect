import React, { useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import { useFirebaseAuth } from "../../context/authContext";

function AuthUserDropdown() {
  const [showDropdown, setShowDropDown] = useState(false);
  const { logOut } = useFirebaseAuth();
  return (
    <div className="relative">
      <button onClick={() => setShowDropDown(!showDropdown)}>
        <FaAngleDown />
      </button>
      {showDropdown && (
        <div className="absolute right-0 bg-gray-50 w-36 rounded px-4 py-4">
          <ul>
            <li className="text-gray-500 py-2">Profile</li>
            <li className="text-gray-500 py-2">Messages</li>
            <li className="text-gray-500 py-2">Applicants</li>
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
