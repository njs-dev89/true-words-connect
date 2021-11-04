import React from "react";
import Image from "next/image";

function UserDetails({ translator }) {
  return (
    <>
      <div className="flex flex-col items-center px-4 pb-4 border-b">
        <div className="w-24 h-24 relative rounded-full overflow-hidden">
          <Image
            src={translator.profile_pic || "/profile-placeholder.png"}
            alt=""
            layout="fill"
          />
        </div>
        <h3 className="font-bold text-lg mt-4 mb-2">{translator.username}</h3>
        <p className="text-center text-sm">
          Tag line Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Nihil?
        </p>
        <p className="text-gray-700 mt-4">Not rated Yet</p>
      </div>
      <div className="px-4 mt-4">
        <h3 className="text-blue font-bold ">Personal Information</h3>
        <div className="flex">
          <div className="mr-4">
            <p className="my-3">Full Name</p>
            <p className="my-3">Email</p>
            <p className="my-3">Location</p>
          </div>
          <div className="text-gray-600">
            <p className="my-3">
              {translator.fullname ? translator.fullname : "Add your name"}
            </p>
            <p className="my-3">{translator.email}</p>
            <p className="my-3">
              {translator?.address?.city
                ? translator.address?.city
                : "Add your city"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserDetails;