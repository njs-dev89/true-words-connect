import React from "react";
import Image from "next/image";
import { RatingView } from "react-simple-star-rating";

function UserDetails({ provider, self }) {
  return (
    <>
      <div className="flex flex-col items-center px-4 pb-4 border-b">
        <div className="w-24 h-24 relative rounded-full overflow-hidden">
          <Image
            src={provider.profile_pic || "/profile-placeholder.png"}
            alt=""
            layout="fill"
          />
        </div>
        <h3 className="font-bold text-lg mt-4 mb-2">{provider.username}</h3>
        <p className="text-center text-sm">
          {provider.tagline || "Add something about yourself"}
        </p>
        <p className="text-gray-700 mt-4">
          {provider.rating ? (
            <RatingView ratingValue={provider.rating} />
          ) : (
            "Not Rated yet"
          )}
        </p>
      </div>
      <div className="px-4 mt-4">
        <h3 className="text-blue font-bold ">Personal Information</h3>
        <div className="flex">
          <div className="mr-4">
            <p className="my-3">Full Name</p>
            {self && <p className="my-3">Email</p>}
            <p className="my-3">Location</p>
          </div>
          <div className="text-gray-600">
            <p className="my-3">
              {provider.fullname ? provider.fullname : "Add your name"}
            </p>
            {self && <p className="my-3">{provider.email}</p>}
            <p className="my-3">
              {provider?.address?.city
                ? provider.address?.city
                : "Add your city"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserDetails;
