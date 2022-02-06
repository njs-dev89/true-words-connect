import * as React from "react";
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
          description="Have your documents and work translated one on one by our freelance providers."
          iconLink="/translation.svg"
        />
        <SingleService
          serviceTitle="Interpretation"
          description="Receive in person or online intertpretation services."
          iconLink="/translation.svg"
        />
        <SingleService
          serviceTitle="Localization"
          description="Businesses can receive services to develop local product and marketing content."
          iconLink="/translation.svg"
        />
        <SingleService
          serviceTitle="Language Learning"
          description="Become a tutor or practice and learn any of over 240 languages in person or online."
          iconLink="/translation.svg"
        />
        <SingleService
          serviceTitle="Content Subtitling"
          description="Have your social media content subtitled, written, and dubbed for your local audience. Offered for Instagram, YouTube, Weibo, WeChat, and more."
          iconLink="/translation.svg"
        />
        <SingleService
          serviceTitle="Proofreading"
          description="Hire local professionals to proofread and edit your work and other documents."
          iconLink="/translation.svg"
        />
      </div>
    </div>
  );
}

export default AvailableServices;
