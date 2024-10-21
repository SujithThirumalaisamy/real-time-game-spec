import { positions, rooms, users } from "./in-memory-store";

export const joinRoomEvent = (roomId: string, token: string, ws: any) => {
  console.log(ws);
  console.log(ws.id);

  const room = rooms.get(roomId);
  if (!room) {
    return {
      type: "error",
      message: "Invalid Room",
    };
  }

  const user = users.get(token);
  if (!user) {
    return {
      type: "error",
      message: "User not found",
    };
  }

  rooms.set(roomId, {
    ...room,
    sockets: room.sockets.push(ws),
  });

  // TODO: make this random within the room boundary
  const defaultPos = {
    x: 0,
    y: 0,
  };

  positions.set(token, defaultPos);

  return {
    type: "info",
    event: "ack",
    data: defaultPos,
  };
};

export const updatePositionEvent = (
  x: number,
  y: number,
  token: string,
  roomId: string
) => {
  const room = rooms.get(roomId);
  if (!room) {
    return {
      type: "error",
      message: "Invalid Room",
    };
  }

  const user = users.get(token);
  if (!user) {
    return {
      type: "error",
      message: "User not found",
    };
  }

  const userPosition = positions.get(token);

  if (!userPosition) {
    return {
      type: "error",
      message: "User position not found",
    };
  }

  let isUnique = true;
  // Loop over the positions map and check the new coords are unique or not
  for (let [key, value] of positions) {
    if (value.x === x && value.y === y) {
      isUnique = false;
      break;
    }
  }

  // If user position is not unique
  if (!isUnique) {
    return {
      event: "position-update",
      data: {
        userId: token,
        x: userPosition.x,
        y: userPosition.y,
      },
    };
  }

  // If user position is unique
  return {
    event: "position-update",
    data: {
      userId: token,
      x: x,
      y: y,
    },
  };
};

export const broadcastPositionEvent = (
  userId: string,
  x: number,
  y: number
) => {};
