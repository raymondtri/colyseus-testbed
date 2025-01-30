import { Room, Client } from "@colyseus/core";
import { MyRoomState } from "./schema/MyRoomState";
import { AuthContext } from "colyseus";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;

  onCreate (options: any) {
    
    // these additional options would usually be populated via environment variables from AWS, for instance
    this.listing.region = "us-east-1";
    this.listing.taskId = "task-1";
    
    this.setState(new MyRoomState());

    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });
  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

  onAuth(client: Client, options: any, context: AuthContext) {
    console.log("onAuth triggered")
    console.log(client)
    console.log(options)
    console.log(context)

    return true;
  }

}
