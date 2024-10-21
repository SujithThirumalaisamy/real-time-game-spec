import express, { type Request } from "express";
import { randomUUID } from "crypto";
import { rooms, users } from "./in-memory-store";
import { WebSocketServer } from "ws";
import ExpressWS from "express-ws";
import { Events } from "./events";

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
    const parsedMsg = msg.toString();

    switch (parsedMsg) {
      case Events.Join:
        break;
      case Events.Position:
        break;
      case Events.UpdatePos:
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
