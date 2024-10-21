import WebSocket from "ws";
import { Events } from "./events";

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("Client Connected");

  ws.on("message", (message) => {
    const parsedMsg = message.toString();

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

  ws.on("close", () => {
    console.log("Client Disconnected");
  });
});
