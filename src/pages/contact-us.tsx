import * as React from "react";
import Footer from "../components/LandingPage/Footer";
import Link from "next/link";
import Head from "next/head";

function ContactUsPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <>
      <div className="bg-light-blue min-h-screen flex items-center">
        <Head>
          <title>Contact us | LangWays</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/langways-globe.png" />
        </Head>
        <div className="container mt-32">
          <div className="max-w-3xl mx-auto shadow-xl bg-white p-8 rounded-xl">
            <h1 className="font-bold text-3xl mb-8">Contact us</h1>

            <form className="" onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <label htmlFor="" className="font-medium text-lg">
                  Name
                </label>
                <input
                  type="text"
                  className="border-2 rounded-lg border-gray-300"
                  placeholder="John doe"
                />
              </div>
              <div className="flex flex-col mt-8">
                <label htmlFor="" className="font-medium text-lg">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="johndoe@email.com"
                  className="border-2 rounded-lg border-gray-300"
                />
              </div>
              <div className="flex flex-col mt-8">
                <label htmlFor="" className="font-medium text-lg">
                  Description
                </label>
                <textarea
                  placeholder="Description"
                  className="border-2 rounded-lg border-gray-300"
                ></textarea>
              </div>
              <div className="text-center">
                <button className="btn btn-yellow mt-8">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ContactUsPage;
