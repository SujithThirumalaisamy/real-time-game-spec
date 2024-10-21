import express, { type Request } from "express";
import { randomUUID } from "crypto";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

const rooms = new Map();
const users = new Map();

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

app.listen(3000, () => {
  console.log("Web Server Running On Port: 3000");
});
