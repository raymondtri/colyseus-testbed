import { Client, Room } from "colyseus.js";
import { cli, Options } from "@colyseus/loadtest";

export async function main(options: Options) {
    // point the endpoint to the express server, or lambda, or whatever for external matchmaking
    options.endpoint = "http://localhost:3000";

    const client = new Client(options.endpoint);
    const room: Room = await client.joinOrCreate(options.roomName, {
        region: "us-east-1"
    });

    console.log("joined successfully!");

    room.onMessage("message-type", (payload) => {
        // logic
    });

    room.onStateChange((state) => {
        console.log("state change:", state);
    });

    room.onLeave((code) => {
        console.log("left");
    });
}

cli(main);
