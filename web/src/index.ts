import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

// POST request to /signup
// POST request to /rooms with bearer token
// GET request to /users/userid
// PUT request to /users/userid/avatar

app.listen(3000, () => {
  console.log("Web Server Running On Port: 3000");
});
