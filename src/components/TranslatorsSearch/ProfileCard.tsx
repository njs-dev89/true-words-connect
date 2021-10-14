import React from "react";
import Image from "next/image";
import Link from "next/link"

function ProfileCard({translator}) {
  return (
    <div className="flex gap-8 border rounded-lg px-6 pt-4 pb-12 mt-4">
      <div className="flex flex-col items-center">
        <div className="relative w-20 h-20 rounded-full overflow-hidden">
          <Image src={translator.profile_pic} alt="" layout="fill" />
        </div>
        <p className="mt-4 text-sm">Not Rated yet</p>
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-baseline">
          <h3 className="font-bold">{translator.username}</h3>

          <Link href={`/translators/profile/${translator.objectID}`}><a className="btn btn-yellow">See Profile</a></Link>
        </div>
        <p className="text-sm font-medium text-gray-500">5Km</p>
        <div className="flex mt-6">
          <p className="font-medium text-gray-700">
            <span className="font-bold text-black">Hourly Rate:</span> ${translator.hourly_rate}
          </p>
          <p className="ml-32 font-medium text-gray-700">
            <span className="font-bold text-black">Language Skills:</span> {translator.languages.join(",")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
