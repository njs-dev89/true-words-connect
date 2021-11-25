import React from "react";
import Footer from "../components/LandingPage/Footer";

function AboutPage() {
  return (
    <>
      <div className="bg-light-blue min-h-screen flex items-center">
        <div className="container mt-32">
          <div className="max-w-2xl mx-auto">
            <h1 className="font-bold text-3xl mb-8">About us</h1>
            <p className="leading-7 mb-4">
              Truewords Connect is an online platform connecting people through
              languages. An online marketplace for freelance language solution
              providers to support anyone in need of language solutions for
              translation, localization, and language learning. In a highly
              fragmented market where some languages and populations are
              underserved, we bring together global languages and communities on
              one platform through our web app. Our Web app provides all the
              benefits of a native app and responsive websites. People get easy
              accessibility even where the Internet is not the strongest, GPS
              enabled, offline mode, push-button notification, and installable
              on a webpage.
            </p>
            <p className="leading-7 mb-4">
              In a world that continue to move towards machine learning (ML) and
              artificial intelligence (AI), we believe AI and machine learning
              should complement our humane natural skills and not replace them.
              Especially with languages, as we believe here at Truewords Connect
              where there is a language, you will find people, a community, and
              a culture. We aim to personalize language solutions through our
              geolocation mapping for access to local providers. Individuals and
              Academia can learn or practice a language, Businesses and
              travelers can get localization, translation, and interpretations
              services through a choice of their freelance providers in any of
              the over 240 languages provided.
            </p>
            <p className="leading-7 mb-16">
              Our mission is to continue developing a platform that empowers
              everyone globally to have seamless access to language solutions.
              It is the people, it is the language, it is the community, and it
              is the culture and the identity. We want to make it all easily
              accessible.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AboutPage;
