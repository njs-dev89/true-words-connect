import * as React from "react";
import Image from "next/image";
import quote from "../../../public/quote.svg";

const SingleTestimonial = ({ imgLink, testimonial, name, designation }) => {
  return (
    <div className="flex flex-col items-start bg-brown px-6 py-8 rounded-lg gap-2">
      <div className="w-16 h-16 relative overflow-hidden rounded-full">
        <Image src={imgLink} layout="fill" />
      </div>
      <p className="my-4 leading-8 text-sm">{testimonial}</p>
      <div className="flex justify-between items-center w-full">
        <div className="">
          <h3 className="text-lg font-bold">{name}</h3>
          <h4 className="text-blue">{designation}</h4>
        </div>
        <div className="w-12 h-12 relative overflow-hidden rounded-full">
          <Image src={quote} layout="fill" />
        </div>
      </div>
    </div>
  );
};

function Testimonials() {
  return (
    <div>
      <h1 className="font-bold text-3xl text-center mb-16">What People Say</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 gap-12 md:gap-4 lg:gap-16">
        <SingleTestimonial
          imgLink="/profile-placeholder.png"
          testimonial='"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed tu diam nonumy eirmod tempor "invidunt ut labore et" -dolore magna aliquyam erat, sed diam voluptua. At vero eos et" -dolore magna aliquyam erat, sed diam '
          name="Monica"
          designation="Researcher, Nat Geo"
        />
        <SingleTestimonial
          imgLink="/profile-placeholder.png"
          testimonial='"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed tu diam nonumy eirmod tempor "invidunt ut labore et" -dolore magna aliquyam erat, sed diam voluptua. At vero eos et" -dolore magna aliquyam erat, sed diam '
          name="Monica"
          designation="Researcher, Nat Geo"
        />
        <SingleTestimonial
          imgLink="/profile-placeholder.png"
          testimonial='"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed tu diam nonumy eirmod tempor "invidunt ut labore et" -dolore magna aliquyam erat, sed diam voluptua. At vero eos et" -dolore magna aliquyam erat, sed diam '
          name="Monica"
          designation="Researcher, Nat Geo"
        />
      </div>
    </div>
  );
}

export default Testimonials;
