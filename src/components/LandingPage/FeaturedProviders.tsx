import React from "react";
import Image from "next/image";
import { RatingView } from "react-simple-star-rating";
import Link from "next/link";

const SingleProvider = ({
  imgLink,
  name,
  languages,
  rating,
  description,
  profileLink,
}) => {
  return (
    <div className="flex flex-col flex-center items-center gap-2 bg-white px-4 pt-12 pb-8 rounded-lg">
      <div className="w-24 h-24 relative overflow-hidden rounded-full">
        <Image src={imgLink} layout="fill" />
      </div>
      <h4 className="text-lg font-bold">{name}</h4>
      <div className="flex gap-2">
        {languages.map((language, idx) => (
          <span className="text-blue bg-blue-200 px-2 py-1 rounded" key={idx}>
            {language}
          </span>
        ))}
      </div>
      <RatingView ratingValue={rating} />
      <p className="text-center mt-4">{description}</p>
      <Link href={profileLink}>
        <a className="btn btn-yellow mt-8 shadow-2xl">View Profile</a>
      </Link>
    </div>
  );
};

function FeaturedProviders() {
  return (
    <div>
      <h1 className="font-bold text-3xl text-center mb-16">
        Featured Providers
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 gap-12 md:gap-4 lg:gap-16">
        <SingleProvider
          name="Sarah Kenedy"
          imgLink="/profile-placeholder.png"
          languages={["English", "TWI", "Swahili"]}
          rating={5}
          description="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor"
          profileLink="/"
        />

        <SingleProvider
          name="Sarah Kenedy"
          imgLink="/profile-placeholder.png"
          languages={["English", "TWI", "Swahili"]}
          rating={5}
          description="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor"
          profileLink="/"
        />

        <SingleProvider
          name="Sarah Kenedy"
          imgLink="/profile-placeholder.png"
          languages={["English", "TWI", "Swahili"]}
          rating={5}
          description="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor"
          profileLink="/"
        />
      </div>
    </div>
  );
}

export default FeaturedProviders;
