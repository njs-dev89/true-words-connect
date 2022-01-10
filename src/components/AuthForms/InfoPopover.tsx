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
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit
            nisi nam perspiciatis. Cumque laudantium culpa aut architecto
            pariatur dignissimos suscipit incidunt, nihil est ab velit cum
            dolorum minima quam! Et.
          </p>
        </div>
      </Popover.Panel>
    </Popover>
  );
}
