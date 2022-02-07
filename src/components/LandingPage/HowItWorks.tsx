import * as React from "react";
import Image from "next/image";
import Link from "next/link";

const SingleStep = ({ iconLink, step, description }) => {
  return (
    <div className="flex bg-brown-dark py-12 px-4 rounded-lg">
      <div className="">
        <div className="w-16 h-16 bg-brown flex items-center justify-center rounded-full">
          <div className=" w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <div className="w-6 h-6 relative flex items-center justify-center font-bold text-xl text-yellow">
              {iconLink}
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
    <div className="pb-16">
      <h1 className="font-bold text-3xl text-center mb-16">How It Works</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-16">
        <SingleStep
          step="Sign Up"
          iconLink="1"
          description="Sign Up with us to access freelanced language services available across the globe."
        />
        <SingleStep
          step="Find Your Provider"
          iconLink="2"
          description="Search through our verified providers to find one that fits you and your needs."
        />

        <SingleStep
          step="Get a Quote"
          iconLink="3"
          description="Get in contact with your selected provider to discuss rates, skills, and location."
        />
        <SingleStep
          step="Start Learning!"
          iconLink="4"
          description="Start your learning! Whether it is translation, localization, interpretation, or simply learning a
          new language, our service providers will be here to support you along the way."
        />
      </div>
      <div className="text-center mt-16">
        <Link href="/providers">
          <a className="btn btn-yellow mr-4 shadow-xl">Find a Provider</a>
        </Link>
        <Link href="/provider-signup">
          <a className="btn btn-outline">Become a Provider</a>
        </Link>
      </div>
    </div>
  );
}

export default HowItWorks;
