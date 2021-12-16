import React from "react";
import Footer from "../components/LandingPage/Footer";

function AboutPage() {
  return (
    <>
      <div className="bg-light-blue min-h-screen flex items-center">
        <div className="container mt-32">
          <div className="max-w-2xl mx-auto">
            <h1 className="font-bold text-3xl mb-8">Our Mission | Providing Language Solutions Globally</h1>
            <p className="leading-7 mb-4">
              Truewords Connect is an online community curated to connect people through language. We
              work to make language solutions both personable and accessible through our developed web app
              that has access to over 240 languages and freelance providers that are located across the globe.
              We offer geolocation mapping and offline learning that caters to both business and personal
              needs. Through creating a digital space for global access to global languages, we aim to build a
              language solution community.
            </p>
            <p className="leading-7 mb-4">
              In a highly fragmented market where many cultures are underserved, we are working to bring
              together communities through the practice and preservation of language. Whether you are
              looking for international or local guidance, our providers offer services that range from
              localization to translation, language learning, and interpretation. Where there is language, you
              will find a community, a culture, and an identity- all which are irreplaceable. No matter where
              you are on your language journey, we are here to see your mission through.
            </p>
            <button>Become a Provider</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AboutPage;
