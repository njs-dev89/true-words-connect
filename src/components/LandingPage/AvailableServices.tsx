import React from "react";
import Image from "next/image";

const SingleService = ({ iconLink, serviceTitle, description }) => {
  return (
    <div className="flex flex-col bg-blue-50 p-8 pb-12 rounded-lg w-96 mx-auto">
      <div className="w-16 h-16 bg-blue flex items-center justify-center rounded-full">
        <div className=" w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <div className="w-6 h-6 relative ">
            <Image src={iconLink} layout="fill" />
          </div>
        </div>
      </div>
      <h4 className="font-bold text-lg my-4">{serviceTitle}</h4>
      <p>{description}</p>
    </div>
  );
};

function AvailableServices() {
  return (
    <div>
      <h1 className="font-bold text-3xl text-center mb-16">
        Available Services
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-8">
        <SingleService
          serviceTitle="Translation"
          description="Become a freelance translator or translate your document by any of our freelance Providers"
          iconLink="/translation.svg"
        />
        <SingleService
          serviceTitle="Interpretation"
          description="Sign up to provide or receive in person or online services."
          iconLink="/translation.svg"
        />
        <SingleService
          serviceTitle="Localization"
          description="Businesses and Marketers can get services to develop local market content."
          iconLink="/translation.svg"
        />
        <SingleService
          serviceTitle="Language Learning"
          description="Be a tutor, practice or learn any of our 240 languages in person or online."
          iconLink="/translation.svg"
        />
        <SingleService
          serviceTitle="Subtitling or Dubbing"
          description="Subtitle or Dub all your social media content for a local audience i.e. Youtube, Instagram, Weibo, WeChat etc."
          iconLink="/translation.svg"
        />
        <SingleService
          serviceTitle="Proofread"
          description="Get local professionals to proofread your work."
          iconLink="/translation.svg"
        />
      </div>
    </div>
  );
}

export default AvailableServices;
