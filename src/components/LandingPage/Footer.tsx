import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="px-4">
      <div className="grid grid-cols-5 max-w-screen-lg mx-auto gap-8 pt-16 border-b pb-16">
        <div className="sm:col-span-2 col-span-5 mx-auto">
          <div className="w-16 h-16 relative overflow-hidden rounded-full">
            <Image src="/logo.svg" layout="fill" />
          </div>
          <p className="text-blue mt-4">Connecting People Through Languages</p>
          <div className="flex gap-2 mt-4">
            <Link href="/">
              <a>
                <span className="bg-yellow w-8 h-8 rounded-full flex items-center justify-center">
                  <FaFacebookF className="text-white" />
                </span>
              </a>
            </Link>
            <Link href="">
              <a>
                <span className="bg-yellow w-8 h-8 rounded-full flex items-center justify-center">
                  <FaTwitter className="text-white" />
                </span>
              </a>
            </Link>
            <Link href="/">
              <a>
                <span className="bg-yellow w-8 h-8 rounded-full flex items-center justify-center">
                  <FaLinkedinIn className="text-white" />
                </span>
              </a>
            </Link>

            <a href="https://www.instagram.com/truewordsconnect">
              <span className="bg-yellow w-8 h-8 rounded-full flex items-center justify-center">
                <FaInstagram className="text-white" />
              </span>
            </a>
          </div>
        </div>
        <div className="col-span-5 sm:col-span-3 mx-auto grid grid-cols-3 gap-6">
          <div className="col-span-1 flex flex-col gap-4">
            <h3 className="font-bold">What we do</h3>
            <Link href="/">
              <a className="text-blue">The Learning Process</a>
            </Link>
            <Link href="/">
              <a className="text-blue">Features</a>
            </Link>
            <Link href="/">
              <a className="text-blue">Blog</a>
            </Link>
          </div>
          <div className="col-span-1 flex flex-col gap-4">
            <h3 className="font-bold">Quick Links</h3>
            <Link href="/">
              <a className="text-blue">FAQ</a>
            </Link>
            <Link href="/privacy-policy">
              <a className="text-blue">Privacy</a>
            </Link>
            <Link href="/">
              <a className="text-blue">Terms and Conditions</a>
            </Link>
            <Link href="/">
              <a className="text-blue">Support</a>
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
            <Link href="/">
              <a className="text-blue">Subscribe</a>
            </Link>
          </div>
        </div>
      </div>
      <div className="py-6 flex justify-center items-center gap-3">
        <div className="w-4 h-4 relative overflow-hidden rounded-full">
          <Image src="/copyright.svg" layout="fill" />
        </div>
        <p className="text-center text-blue">
          All Right Reserved By Truewords Connect
        </p>
      </div>
    </footer>
  );
}

export default Footer;
