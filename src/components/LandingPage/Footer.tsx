import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaTwitter,
} from "react-icons/fa";
import globe from "../../../public/langways-globe.png";
import copyright from "../../../public/copyright.svg";

function Footer() {
  return (
    <footer className="px-4">
      <div className="grid grid-cols-5 max-w-screen-lg mx-auto gap-8 pt-16 border-b pb-16">
        <div className="sm:col-span-2 col-span-5 mx-auto">
          <div className="w-16 h-16 relative overflow-hidden rounded-full">
            <Image src={globe} layout="fill" />
          </div>
          <p className="text-blue mt-4">Connecting People Through Languages</p>
          <div className="flex gap-2 mt-4">
            <a href="https://www.facebook.com/langways.io">
              <span className="bg-yellow w-8 h-8 rounded-full flex items-center justify-center">
                <FaFacebookF className="text-white" />
              </span>
            </a>

            <a href="https://twitter.com/lang_ways">
              <span className="bg-yellow w-8 h-8 rounded-full flex items-center justify-center">
                <FaTwitter className="text-white" />
              </span>
            </a>

            <a href="https://www.linkedin.com/company/langways/about/?viewAsMember=true">
              <span className="bg-yellow w-8 h-8 rounded-full flex items-center justify-center">
                <FaLinkedinIn className="text-white" />
              </span>
            </a>

            <a href="https://www.instagram.com/langways.io">
              <span className="bg-yellow w-8 h-8 rounded-full flex items-center justify-center">
                <FaInstagram className="text-white" />
              </span>
            </a>
            <a href="https://www.tiktok.com/@langways">
              <span className="bg-yellow w-8 h-8 rounded-full flex items-center justify-center">
                <FaTiktok className="text-white" />
              </span>
            </a>
          </div>
        </div>
        <div className="col-span-5 sm:col-span-3 mx-auto grid grid-cols-3 gap-6">
          <div className="col-span-1 flex flex-col gap-4">
            <h3 className="font-bold">What we do</h3>

            <a className="text-blue" href="#works">
              The Learning Process
            </a>

            <Link href="/acceptable-use-policy">
              <a className="text-blue">Acceptable use policy</a>
            </Link>

            <Link href="/blog">
              <a className="text-blue">Blog</a>
            </Link>
          </div>
          <div className="col-span-1 flex flex-col gap-4">
            <h3 className="font-bold">Our Company</h3>
            <Link href="/about-us">
              <a className="text-blue">About us</a>
            </Link>
            <Link href="/">
              <a className="text-blue">Become a partner</a>
            </Link>
            <Link href="/contact-us">
              <a className="text-blue">Contact us</a>
            </Link>
          </div>
          <div className="col-span-1 flex flex-col gap-4">
            <h3 className="font-bold">Quick Links</h3>
            <Link href="/faqs">
              <a className="text-blue">FAQ</a>
            </Link>
            <Link href="/privacy-policy">
              <a className="text-blue">Privacy</a>
            </Link>
            <Link href="/terms-of-service">
              <a className="text-blue">Terms and Conditions</a>
            </Link>
            <Link href="/cookie-policy">
              <a className="text-blue">Cookie Policy</a>
            </Link>
          </div>
        </div>
      </div>
      <div className="py-6 flex justify-center items-center gap-3">
        <div className="w-4 h-4 relative overflow-hidden rounded-full">
          <Image src={copyright} layout="fill" />
        </div>
        <p className="text-center text-blue">
          All Rights Reserved By langways.io
        </p>
      </div>
    </footer>
  );
}

export default Footer;
