import React from "react";
import SingleRoom from "./SingleRoom";

function MessageRooms({ rooms }) {
  return (
    <div className="col-span-3 md:col-span-1 h-72">
      {rooms.map((room) => (
        <SingleRoom room={room} key={room.id} />
      ))}
    </div>
  );
}

export default MessageRooms;
