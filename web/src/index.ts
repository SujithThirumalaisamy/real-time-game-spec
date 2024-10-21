import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

// POST request to /signup
app.post("/signup", (req, res) => {});

// POST request to /rooms with bearer token
app.post("/rooms", (req, res) => {});

// GET request to /users/userid
app.get("/users/:userId", (req, res) => {});

// PUT request to /users/userid/avatar
app.get("/users/:userId/avatar", (req, res) => {});

app.listen(3000, () => {
  console.log("Web Server Running On Port: 3000");
});
