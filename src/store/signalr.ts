// import { defineStore } from "pinia";
// import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

// export interface Message {
//   id: string;
//   text: string;
// }

// interface State {
//   connections: Record<string, HubConnection>; // object to store connections
//   messages: Record<string, Message[]>; // object to store messages for each endpoint
// }

// export const useSignalRStore = defineStore("signalr", {
//   state: (): State => ({
//     connections: {},
//     messages: {},
//   }),

//   actions: {
//     async connect(endpoint: string) {
//       // create connection for endpoint if it doesn't exist
//       if (!this.connections[endpoint]) {
//         const connection = new HubConnectionBuilder()
//           .withUrl(`https://localhost:63125${endpoint}`)
//           .withAutomaticReconnect()
//           .build();

//         // store connection
//         this.connections[endpoint] = connection;

//         // initialize messages array for endpoint
//         this.messages[endpoint] = [];

//         // register event handler for incoming messages
//         this.connections[endpoint].on("ReceiveMessage", (message: Message) => {
//           // add message to endpoint's messages array
//           this.messages[endpoint].push(message);
//         });

//         // start the connection
//         await this.connections[endpoint].start();
//       }
//     },

//     disconnect(endpoint: string) {
//       // close the connection for endpoint if it exists
//       if (this.connections[endpoint]) {
//         this.connections[endpoint].stop();
//         delete this.connections[endpoint];
//         delete this.messages[endpoint];
//       }
//     },
//   },
// });
import { defineStore } from "pinia";
import { MarketDisplayItem } from "@/models/marketData";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

interface ConnectionInfo {
  endpoint: string;
  connection: HubConnection;
  heartbeatInterval: number;
}
// export interface Message {
//   id: string;
//   text: string;
// }

export interface Message {
  type: number;
  target: "MarketDisplay" | "MarketDisplayTable";
  arguments: MarketDisplayItem[];
}
interface State {
  connections: Record<string, ConnectionInfo>; // object to store connections
  // messages: Record<string, { group: string; items: MarketDisplayItem[] }[]>; // object to store messages for each endpoint
  messages: Record<string, MarketDisplayItem[]>;
  isAlive: boolean;
}

export const useSignalRStore = defineStore("signalr", {
  state: (): State => ({
    connections: {},
    messages: {},
    isAlive: true,
  }),
  getters: {
    getConnections(): ConnectionInfo[] {
      return Object.values(this.connections);
    },
    getMessages(): Record<string, MarketDisplayItem[]> {
      return this.messages;
    },
  },
  actions: {
    async connect(endpoint: string) {
      if (!this.connections[endpoint]) {
        const connection = new HubConnectionBuilder()
          .withUrl(`${import.meta.env.VITE_APP_API_URL}${endpoint}`)
          .withAutomaticReconnect()
          .build();

        this.connections[endpoint] = {
          endpoint,
          connection,
          heartbeatInterval: 0,
        };
        // initialize messages array for endpoint
        this.messages[endpoint] = [];
        // start the connection
        await this.connections[endpoint].connection.start();
        // register event handler for incoming messages
        this.connections[endpoint].connection.on(
          "MarketDisplay",
          (message: Message) => {
            // add message to endpoint's messages array
            console.log("Message ", message);
            // message.arguments.forEach((e) => this.messages[endpoint].push(e));
            // this.messages[endpoint].push(message);
          }
        );
        this.connections[endpoint].connection.onreconnecting((error) => {
          console.log("Error on reconnect ", error);
        });
        this.connections[endpoint].connection.on(
          "MarketDisplayTable",
          (message: string) => {
            // convert from string to json
            let temp = JSON.parse(message);
            if (Array.isArray(temp)) {
              temp = temp.map((e) => e as MarketDisplayItem);
            }

            // add message to endpoint's messages array

            console.log("Message Table", endpoint, message, temp);
            this.messages[endpoint] = temp;
          }
        );

        // register event handler for server's Pong response
        // this.connections[endpoint].connection.on("Pong", () => {
        //   this.isAlive = true;
        // });

        // set up heartbeat interval for connection
        this.connections[endpoint].heartbeatInterval = window.setInterval(
          () => {
            // if (this.isAlive) {
            //   this.isAlive = false;
            //   this.connections[endpoint].connection.send("Ping");
            // } else {
            //   // if server didn't respond to last heartbeat, close the connection
            //   console.log(
            //     `No response from ${endpoint}. Closing connection...`
            //   );
            //   this.disconnect(endpoint);
            // }
          },
          1000
        );
      }
    },

    disconnect(endpoint: string) {
      let splitted = endpoint;
      if (endpoint.includes(import.meta.env.VITE_APP_API_URL)) {
        splitted = endpoint.split(import.meta.env.VITE_APP_API_URL)[1];
      }

      console.log("Disconnect ", splitted, endpoint);
      // close the connection for endpoint if it exists
      if (this.connections[splitted]) {
        window.clearInterval(this.connections[splitted].heartbeatInterval);
        this.connections[splitted].connection.stop();
        delete this.connections[splitted];
        delete this.messages[splitted];
      }
    },
  },
});
