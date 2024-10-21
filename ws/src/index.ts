import WebSocket from "ws";

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("Client Connected");

  ws.on("message", (message) => {
    console.log("Received message:", message.toString());

    ws.send("Message received successfully!");
  });

  ws.on("close", () => {
    console.log("Client Disconnected");
  });
});
