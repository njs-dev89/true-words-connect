import React from "react";
import Image from "next/image";

const SingleStep = ({ iconLink, step, description }) => {
  return (
    <div className="flex bg-brown-dark py-12 px-4 rounded-lg">
      <div className="">
        <div className="w-16 h-16 bg-brown flex items-center justify-center rounded-full">
          <div className=" w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <div className="w-6 h-6 relative ">
              <Image src={iconLink} layout="fill" />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full ml-4">
        <h3 className="text-lg font-bold mb-3">{step}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

function HowItWorks() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-32">
      <SingleStep
        step="Sign up"
        iconLink="/signup.svg"
        description="Complete sign up process to avail our awesome services"
      />
      <SingleStep
        step="Search Provider"
        iconLink="/signup.svg"
        description="Search our verified providers on the search page using their skills, hourly rate, rating or location."
      />

      <SingleStep
        step="Get a quote"
        iconLink="/signup.svg"
        description="Search our verified providers on the search page using their skills, hourly rate, rating or location."
      />
      <SingleStep
        step="Accept offer"
        iconLink="/signup.svg"
        description="Search our verified providers on the search page using their skills, hourly rate, rating or location."
      />
    </div>
  );
}

export default HowItWorks;
