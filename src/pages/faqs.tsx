import * as React from "react";
import Footer from "../components/LandingPage/Footer";
import Head from "next/head";

function FaqsPage() {
  return (
    <>
      <div className="bg-light-blue min-h-screen flex items-center">
        <Head>
          <title>FAQS | LangWays</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/langways-globe.png" />
        </Head>
        <div className="container mt-32">
          <div className="max-w-3xl mx-auto shadow-xl bg-white p-8 rounded-xl">
            <h1 className="font-bold text-3xl mb-8">FAQS</h1>{" "}
            <h3 className="font-semibold text-xl mb-6">
              Can I Select multiple languages to teach?
            </h3>{" "}
            <p className="leading-7 mb-4">
              Yes, you can select multiple languages out of over 240 available.
              If you can not find your language, drop us a message at
              contact@langways.io and we will add it.
            </p>{" "}
            <h3 className="font-semibold text-xl mb-6">
              Can I offer multiple services as a provider, example translating
              and Interpreting?
            </h3>{" "}
            <p className="leading-7 mb-4">
              Yes, you can offer all your language skills for Service. Show off
              in your profile.
            </p>{" "}
            <h3 className="font-semibold text-xl mb-6">
              Do I have to pay to register?
            </h3>
            <p className="leading-7 mb-4">
              {" "}
              No, join us for free as a language service provide or user in need
              of language solutions.
            </p>{" "}
            <h3 className="font-semibold text-xl mb-6">
              Can I register to provide offline in person language service?
            </h3>{" "}
            <p className="leading-7 mb-4">
              Yes, you can. We acknowledge some people learn best in person and
              some people travel to remote area with no internet service and
              need interpretation.
            </p>{" "}
            <h3 className="font-semibold text-xl mb-6">
              Should I make payment off the Langways.io platform?
            </h3>
            <p className="leading-7 mb-4">
              No, we encourage all users to use our state-of-the-art payment
              system to transact for their protection and ensuring delivery of
              services. Report anyone making such request.
            </p>{" "}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default FaqsPage;
