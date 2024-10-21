import { createServer } from "http";
import { WebSocketServer } from "ws";

function onSocketError(err) {
  console.error(err);
}

const server = createServer();
const wss = new WebSocketServer({ noServer: true });

wss.on("connection", function connection(ws, request, client) {
  ws.on("error", console.error);

  ws.on("message", function message(data) {
    console.log(`Received message ${data} from user ${client}`);
  });
});

server.on("upgrade", function upgrade(request, socket, head) {
  wss.handleUpgrade(request, socket, head, function done(ws) {
    wss.emit("connection", ws, request, client);
  });
});

server.listen(8080);
