import axios, { AxiosError } from "axios";
import { test, expect, describe, beforeEach } from "bun:test";

const WEB_URL = "http://localhost:3000";
const WS_URL = "ws://localhost:3000/";

describe("Testing both Web & Websocket", () => {
  test("Test Signup Endpoint", async () => {
    const res = await axios.post(`${WEB_URL}/signup`, {
      username: "sargam",
      password: "pdl",
    });

    expect(res.data).not.toBeUndefined();
    expect(res.data.token).toBeString();
  });

  test("Test Create Room Endpoint", async () => {
    const res = await axios.post(`${WEB_URL}/signup`, {
      username: "sargam",
      password: "pdl",
    });

    const token = res.data.token;
    const response = await axios.post(
      `${WEB_URL}/rooms`,
      { len: 10, bred: 10 },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    expect(response.data).not.toBeUndefined();
    expect(response.data.roomId).toBeString();
  });

  test("Test Create Room Endpoint without Token", async () => {
    try {
      const response = await axios.post(`${WEB_URL}/rooms`, {
        len: 10,
        bred: 10,
      });
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        expect(e.status).toEqual(401);
      }
    }
  });
  test("Test Join Room Functionality", async () => {
    const res = await axios.post(`${WEB_URL}/signup`, {
      username: "sargam",
      password: "pdl",
    });

    const token = res.data.token;
    const response = await axios.post(
      `${WEB_URL}/rooms`,
      { len: 10, bred: 10 },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const socket = new WebSocket("ws://localhost:3000");

    socket.addEventListener("open", () => {
      socket.send(
        JSON.stringify({
          event: "JOIN",
          payload: {
            roomId: response.data.roomId,
            token: res.data.token,
          },
        })
      );

      socket.addEventListener("message", (msg) => {
        const parsed = JSON.parse(msg.data);

        expect(parsed.event).toEqual("ack");
        expect(parsed.data).toBeObject();
        expect(parsed.data.x).toBeNumber();
        expect(parsed.data.y).toBeNumber();
      });
    });
  });

  test("Test Update Postion Functionality", async () => {
    const res = await axios.post(`${WEB_URL}/signup`, {
      username: "sargam",
      password: "pdl",
    });

    const token = res.data.token;
    const response = await axios.post(
      `${WEB_URL}/rooms`,
      { len: 10, bred: 10 },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const socket = new WebSocket("ws://localhost:3000");
    console.log(response.data.roomId);
    console.log(res.data.token);

    socket.addEventListener("open", () => {
      socket.send(
        JSON.stringify({
          event: "JOIN",
          payload: {
            roomId: response.data.roomId,
            token: res.data.token,
          },
        })
      );

      socket.addEventListener("message", (msg) => {
        const x = 5,
          y = 5;
        socket.send(
          JSON.stringify({
            event: "UPDATE_POSITION",
            payload: {
              roomId: response.data.roomId,
              token: res.data.token,
              x,
              y,
            },
          })
        );

        const parsedMsg = JSON.parse(msg.data);
        // @ts-ignore
        if (msg.event !== "position-update") return;

        expect(parsedMsg.data).toBeObject();
        expect(parsedMsg.data.userId).toBeString();
        expect(parsedMsg.data.x).toEqual(x);
        expect(parsedMsg.data.y).toEqual(y);
      });
    });
  });
});
