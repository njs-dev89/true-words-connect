import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { RatingView } from "react-simple-star-rating";
import haversine from "haversine-distance";

function ProfileCard({ provider, currentPosition }) {
  return (
    <div className="flex flex-col sm:flex-row gap-8 border rounded-lg px-6 pt-4 pb-12 mt-4 relative">
      <div className="flex flex-col items-center">
        <div className="relative w-20 h-20 rounded-full overflow-hidden">
          <Image src={provider.profile_pic} alt="" layout="fill" />
        </div>
        <p className="mt-4 text-sm">
          {provider.rating ? (
            <RatingView ratingValue={provider.rating} size={15} />
          ) : (
            "Not Rated Yet"
          )}
        </p>
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-baseline">
          <h3 className="font-bold">{provider.username}</h3>

          <Link href={`/providers/profile/${provider.objectID}`}>
            <a className="btn btn-yellow  sm:relative">See Profile</a>
          </Link>
        </div>
        <p className="text-sm font-medium text-gray-500">
          {provider._geoloc && currentPosition
            ? `${new Intl.NumberFormat("en-US", {
                style: "unit",
                unit: "kilometer",
              }).format(haversine(provider._geoloc, currentPosition) / 1000)}`
            : " "}
        </p>
        <div className="flex flex-col sm:flex-row mt-6">
          <p className="font-medium text-gray-700">
            <span className="font-bold text-black">Hourly Rate:</span> $
            {provider.hourly_rate}
          </p>
          <p className="sm:ml-32 mt-4 sm:mt-0 font-medium text-gray-700">
            <span className="font-bold text-black">Language Offered:</span>{" "}
            {provider.languages.map((lang) => lang.language).join(",")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
