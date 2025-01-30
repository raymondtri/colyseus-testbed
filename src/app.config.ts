import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";

import { ValkeyDriver } from "@colyseus/valkey-driver";

const redisStr = `redis://127.0.0.1:6379`;

/**
 * Import your Room files
 */
import { MyRoom } from "./rooms/MyRoom";

let gameServerRef: any;

export default config({

    options: {
        devMode: true,
        publicAddress: "127.0.0.1:2567",
        driver: new ValkeyDriver({
            metadataSchema: {
                region: 'string',
                taskId: 'string',
            },
            externalMatchmaker: true
        }, redisStr),
        selectProcessIdToCreateRoom: async (roomName: string, clientOptions: any) => {
            console.log(gameServerRef.driver)
            
            return gameServerRef.driver.ownProcessId;
        }
    },

    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        
        // these additional options would usually be populated via environment variables from AWS, for instance
        gameServer.define('my_room', MyRoom, {
            region: 'us-east-1',
            taskId: 'task-1',
        });

        gameServerRef = gameServer;
    },

    initializeExpress: (app) => {
        /**
         * Bind your custom express routes here:
         * Read more: https://expressjs.com/en/starter/basic-routing.html
         */
        app.get("/hello_world", (req, res) => {
            res.send("It's time to kick ass and chew bubblegum!");
        });

        /**
         * Use @colyseus/playground
         * (It is not recommended to expose this route in a production environment)
         */
        if (process.env.NODE_ENV !== "production") {
            app.use("/", playground);
        }

        /**
         * Use @colyseus/monitor
         * It is recommended to protect this route with a password
         * Read more: https://docs.colyseus.io/tools/monitor/#restrict-access-to-the-panel-using-a-password
         */
        app.use("/colyseus", monitor());
    },


    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }
});
