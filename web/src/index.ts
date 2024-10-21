import express, { json, type Request } from "express";
import { randomUUID } from "crypto";
import { rooms, users } from "./in-memory-store";
import ExpressWS from "express-ws";
import { Events } from "./events";
import { joinRoomEvent, updatePositionEvent } from "./handle-events";

const app = express();

const expressWs = ExpressWS(app);

app.use(express.json());
app.use(function (req, res, next) {
  console.log("middleware");
  // @ts-ignore
  req.testing = "testing";
  return next();
});

app.get("/", (req, res) => {
  res.send("Hello world");
});

// POST request to /signup
app.post("/signup", (req, res): any => {
  const { username, password } = req.body;
  const userId = randomUUID();

  users.set(userId, {
    username,
    password,
  });

  return res.json({
    token: userId,
  });
});

// POST request to /rooms with bearer token
app.post("/rooms", (req, res) => {
  // Check for bearer token
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.send(401);
  }

  const user = users.get(token);

  if (!user) {
    res.json({
      error: "user not found",
    });
  }

  const { len, bred } = req.body;
  const roomId = randomUUID();
  rooms.set(roomId, {
    len,
    bred,
    sockets: [],
  });

  res.json({
    roomId,
  });
});

// GET request to /users/userid
app.get("/users/:userId", (req, res): any => {
  const userId = req.params.userId;
  if (!userId) {
    return res.send(404);
  }

  const user = users.get(userId);
  if (!user) {
    return res.json({
      error: "user not found",
    });
  }

  return res.json({
    userId,
    ...user,
  });
});

// PUT request to /users/userid/avatar
app.put("/users/:userId/avatar", (req, res): any => {
  const userId = req.params.userId;
  if (!userId) {
    return res.send(404);
  }

  const user = users.get(userId);
  if (!user) {
    return res.json({
      error: "user not found",
    });
  }
  const { avatar } = req.body;

  users.set(userId, {
    ...user,
    avatar,
  });

  return res.json({
    ...user,
    avatar,
  });
});

// @ts-ignore
app.ws("/", function (ws, req) {
  // @ts-ignore
  ws.on("message", function (msg) {
    console.log(msg.toString());
    const parsedMsg = JSON.parse(msg.toString()) as {
      event: Events;
      payload: any;
    };

    const { token, roomId } = parsedMsg.payload;
    let res;

    switch (parsedMsg.event) {
      case Events.Join:
        res = JSON.stringify(joinRoomEvent(roomId, token, ws));
        ws.send(res);
        break;

      case Events.UpdatePos:
        const { x, y } = parsedMsg.payload;
        res = updatePositionEvent(x, y, token, roomId);

        // @ts-ignore
        if (res.error) {
          ws.send(JSON.stringify(res));
        }

        // for (let socket of users.get(roomId)) socket.send(JSON.stringify(res));
        console.log(rooms.get(roomId));
        ws.send("something");

        break;
      default:
        throw new Error("Not allowed event");
    }

    ws.send("Message received successfully!");
  });
  console.log("socket", req.testing);
});

app.listen(3000, () => {
  console.log("Web Server Running On Port: 3000");
});
