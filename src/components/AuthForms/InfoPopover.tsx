import { Popover } from "@headlessui/react";
import { IoMdInformationCircleOutline } from "react-icons/io";

export default function MyPopover() {
  return (
    <Popover className="relative mb-4 ">
      <Popover.Button className="flex items-center gap-2 text-sm font-medium text-gray-500">
        <IoMdInformationCircleOutline className="text-blue" /> Why we need this
        information?
      </Popover.Button>
      <Popover.Overlay
        className={`${
          open ? "opacity-30 fixed inset-0" : "opacity-0"
        } bg-black`}
      />
      <Popover.Panel className="absolute z-10">
        <div className="bg-gray-100 px-6 py-8 rounded-lg shadow-lg text-base">
          <h3 className="text-medium">Why we need this information?</h3>
          <p className="text-sm">
            We need all the information for our sign-up process to:
          </p>
          <ul className="text-sm">
            <li>Confirm your identity</li>
            <li>Ensure the safety of the community</li>
            <li>Ensure you are a qualified language professional</li>
            <li>To review your application</li>
            <li>Maintain high standards for all involved</li>
          </ul>
        </div>
      </Popover.Panel>
    </Popover>
  );
}
