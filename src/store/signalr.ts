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
export interface MarketDisplayItem {
  displaySeq: string;
  contract: string;
  qtyBid: string;
  bid: string;
  offer: string;
  qtyOffer: string;
  change: string;
  time: string;
  last: string;
  hi: string;
  lo: string;
  volume: string;
  openPrice: string;
  contractSeq: string;
  dateSeq: string;
  strikeSeq: string;
  secondContractSeq: string;
  secondDateSeq: string;
}

export interface Message {
  type: number;
  target: "MarketDisplay" | "MarketDisplayTable";
  arguments: MarketDisplayItem[];
}
interface State {
  connections: Record<string, ConnectionInfo>; // object to store connections
  messages: Record<string, { group: string; items: MarketDisplayItem[] }[]>; // object to store messages for each endpoint
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
    getMessages(): Record<string,  { group: string; items: MarketDisplayItem[] }[]> {
      return this.messages;
    },
  },
  actions: {
    async connect(endpoint: string) {
      if (!this.connections[endpoint]) {
        const connection = new HubConnectionBuilder()
          .withUrl(`https://localhost:63125${endpoint}`)
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
          "marketDisplay",
          (message: Message) => {
            // add message to endpoint's messages array
            console.log("Message ", message);
            // message.arguments.forEach((e) => this.messages[endpoint].push(e));
            // this.messages[endpoint].push(message);
          }
        );
        this.connections[endpoint].connection.on(
          "marketDisplayTable",
          (message: MarketDisplayItem[]) => {
            // add message to endpoint's messages array
            console.log("Message Table", endpoint, message);
            // message.forEach((e) => this.messages[endpoint].push(e));

            // 239
            // const groups = message.reduce((acc: Record<string, MarketDisplayItem[]>, item) => {
            //   const match = item.contract.match(/^(.*?)\s+(.*)$/);
            //   const code = match && match[1] ? match[1] : "xx";
            //   const group = match && match[2] ? match[2].trim() : "unknown"; // if group is missing, group under "unknown"
            //   console.log(`Contract: ${item.contract}, Code: ${code}, Group: ${group}`);
            //   if (!acc[group]) {
            //     acc[group] = [];
            //   }
            //   acc[group].push(item);
            //   return acc;
            // }, {});
            const groups = message.reduce(
              (acc: Record<string, MarketDisplayItem[]>, item) => {
                const regexMatch = item.contract.match(
                  /^(.*?)\s+(\w{4})(\/\w{4})?$/
                );
                let group;
                if (regexMatch) {
                  group = regexMatch[2];
                } else {
                  const phrases = item.contract.split(" ");
                  if (phrases.length === 2) {
                    group = phrases[1];
                  } else {
                    acc.unknown.push(item);
                    return acc;
                  }
                }
                const fullGroup = group;
                if (!acc[JSON.stringify(fullGroup)]) {
                  acc[JSON.stringify(fullGroup)] = [];
                }
                acc[JSON.stringify(fullGroup)].push(item);
                return acc;
              },
              { unknown: [] }
            );
            console.log("Groups: (", Object.keys(groups).length, ")", groups);
            // const tableData = Object.entries(groups);
            // console.log("Table data: (", tableData, ")");
            this.messages[endpoint] = Object.entries(groups).map((e) => {
              return {
                group: e[0],
                items: e[1]
              }
            });

            // this.messages[endpoint].push(message);
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
      if (endpoint.includes("https://localhost:63125")) {
        splitted = endpoint.split("https://localhost:63125")[1];
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