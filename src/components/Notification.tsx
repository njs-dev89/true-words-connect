import * as React from "react";
import Image from "next/image";

function Notification({ notification }) {
  return (
    <div>
      <h3 className="font-bold text-lg text-blue mb-4">{notification.title}</h3>
      <div className="flex items-center">
        <div className="relative h-10 w-10 overflow-hidden rounded-full mr-2">
          {" "}
          <Image src={notification.user.profile_pic} layout="fill" alt="" />
        </div>
        <p className="font-semibold">{notification.user.username}</p>
      </div>
      <p className="ml-12">{notification.message}</p>
    </div>
  );
}

export default Notification;
