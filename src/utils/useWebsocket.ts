import { ref, onMounted, onUnmounted, Ref } from "vue";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { instance } from "@/plugins/axios";
import { useContractsStore } from "@/store/contracts";
import { useMarketDisplayStore } from "@/store/marketDisplay";
import { PublishAll, MarketDisplayItemContract } from "@/models/marketData";
// const mainStore = useContractsStore();

type Custom = MarketDisplayItemContract;
type StoreType = typeof useContractsStore | typeof useMarketDisplayStore;

export function useWebSocket<T extends Custom>(
  store: StoreType,
  url: string
): {
  socket: Ref<HubConnection | null>;
  data: Ref<Custom>;
  subscribe: (list: string[]) => Promise<boolean>
} {
  let socket = ref<HubConnection | null>(null) as Ref<HubConnection | null>;
  let data = ref<any>(null);

  onMounted(() => {
    connect(url);
  });

  onUnmounted(() => {
    disconnect(url);
  });
  const disconnect = (endpoint: string) => {
    console.log("Disconnect futures with subs", endpoint);
    socket.value?.stop();
  };

  const connect = async (endpoint: string) => {
    console.log("Attempt to connect");

    // signalrStore.connect(endpoint);
    socket.value = new HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_APP_API_URL}${endpoint}`)
      .withAutomaticReconnect()
      .build();

    await socket.value
      .start()
      .then(async () => {
        // init data here for each panel
        console.log("Socket connected here");
        if (socket.value) {
          // socket.value.on("MarketInit", (message: any) => {
          //   console.log("Inner market init Message ", message);
          //   try {
          //     const temp = createTypedObject<T>(message);
          //     console.log("Parsed update : ", message, temp);
          //     mainStore.updateItem(temp);
          //   } catch (err) {
          //     console.error("error parsing OPTIONS: ", message, err);
          //   }
          // });
          console.log("Invoke market init");
          // connectionState.connection.invoke("PublishAll");
          // const res = await instance.get("/api/download/publishall", {
          //   params: {
          //     publish: true,
          //     enumVal: PublishAll.ContractDate,
          //   },
          // });
          // if (res) {
          //   console.log("Publish all Result ", res.data);
          // }
        }
      })
      .catch((err) => {
        console.error("Error starting socket ", err);
      });

    socket.value.on("connected", (message: string) => {
      console.log("Socket connected ", message, socket.value?.connectionId);
    });

    socket.value.on("message", (message: string) => {
      console.log("Socket message ", message);
    });

    socket.value.on("MarketUpdate", (message: string) => {
      console.log("Socket Message ", message);
      try {
        const temp = createTypedObject<T>(message);
        console.log("Parsed update : ", message, temp);
        store().updateItem(temp);
      } catch (err) {
        console.error("error parsing OPTION MARKET UPDATE for ", message, err);
      }
    });
    socket.value.on("marketUpdate", (message: string) => {
      console.log("Socket message ", message);
    });
  };
  function createTypedObject<T>(data: string | object): T {
    const parsedData = typeof data === "string" ? JSON.parse(data) : data;
    const typedObject: Partial<T> = {};

    for (const key in parsedData) {
      const value = parsedData[key];

      if (typeof value === "string" || typeof value === "number") {
        typedObject[key as keyof T] = value as T[keyof T];
      } else if (typeof value === "object") {
        typedObject[key as keyof T] = createTypedObject<T[keyof T]>(
          value
        ) as T[keyof T];
      } else {
        throw new Error(`Invalid data for field ${key}`);
      }
    }
    return typedObject as T;
  }
  async function subscribe(list: string[]) {
    console.log("Requested Subscribe on abstract", list);
    let res: any = null;
    if (socket.value) {
      res = await socket.value.invoke("Subscribe", list);
    }
    

    //return state of subscribe
    return res != null ? true : false;
  }

  return { socket, data, subscribe };
}
