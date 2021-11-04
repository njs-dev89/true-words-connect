import React from "react";
import SingleRoom from "./SingleRoom";

function MessageRooms({ rooms }) {
  return (
    <div>
      {rooms.map((room) => (
        <SingleRoom room={room} key={room.id} />
      ))}
    </div>
  );
}

export default MessageRooms;
