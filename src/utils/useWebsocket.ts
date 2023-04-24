import {
  shallowRef,
  ref,
  onMounted,
  onUnmounted,
  Ref,
  computed,
  ComputedRef,
} from "vue";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
// import { instance } from "@/plugins/axios";
// import { useContractsStore } from "@/store/contracts";
// import { useMarketDisplayStore } from "@/store/marketDisplay";
// import { useActiveOrdersStore } from "@/store/activeOrders";
// import { useCompletedOrdersStore } from "@/store/completedOrders";
import {
  PublishAll,
  MarketDisplayItemContract,
  FilterCondition,
  ActiveOrder,
  CompletedOrder,
} from "@/models/marketData";

import { createBaseStore } from "@/store/baseStore";
import { CustomActiveOrderActions } from "@/store/customActiveOrders";
export type CommonStore<T extends WebSocketDataType, U = {}> = ReturnType<
  typeof createBaseStore<T>
> &
  U;
// export type CommonStore<T> = ReturnType<typeof createBaseStore<T>> & Partial<CustomActiveOrderActions>;
export type CustomStore<T extends WebSocketDataType, U> = CommonStore<T> & {
  [K in keyof U]: U[K];
};

type WebSocketDataType =
  | MarketDisplayItemContract
  | ActiveOrder
  | CompletedOrder;

  export function useWebSocket<T extends WebSocketDataType, U = {}>(
    store: ReturnType<typeof createBaseStore<T, U>>,
  url: string,
  filters: FilterCondition[]
): {
  socket: Ref<HubConnection | null>;
  currentSubscriptions: Ref<T[]>;
  instrumentsToAdd: Ref<T[]>;
  filteredData: ComputedRef<T[]>;
  subscribeToSelected: () => boolean;
  subscribe: (list: string[]) => Promise<boolean>;
} {
  const instrumentsToAdd = shallowRef<T[]>([]);
  const socket = ref<HubConnection | null>(null) as Ref<HubConnection | null>;
  const currentSubscriptions = shallowRef<T[]>([]);

  onMounted(() => {
    connect(url);
  });

  onUnmounted(() => {
    disconnect(url);
  });
  const subscribeToSelected = () => {
    try {
      console.log("Subscribing to : ", instrumentsToAdd);
      // subscribe(instrumentsToAdd.value.map((e) => e.contract));
      // instrumentsToAdd.value.forEach((e) => {
      //   currentSubscriptions.value.push(e);
      // });
      // instrumentsToAdd.value.splice(0);
      return true;
    } catch (err) {
      return false;
    }
  };
  function applyConditions(item: any, conditions: FilterCondition[]): boolean {
    return conditions.every((condition) => {
      const fieldValue = condition.field
        .split(".")
        .reduce((o, i) => o[i], item);
      const { operator, value } = condition;

      switch (operator) {
        case "==":
          if (fieldValue == value) {
            console.log(
              "Op full : ",
              fieldValue,
              operator,
              value,
              fieldValue == value
            );
          }
          return fieldValue == value;

        case "!==":
          if (fieldValue !== value) {
            console.log(
              "Op full : ",
              fieldValue,
              operator,
              value,
              fieldValue !== value,
              fieldValue != value
            );
          }
          return fieldValue !== value;
        case ">":
          if (fieldValue <= value) {
            console.log(
              "Op full : ",
              fieldValue,
              operator,
              value,
              fieldValue > value
            );
          }
          return fieldValue > value;

        case "<":
          if (fieldValue >= value) {
            console.log(
              "Op full : ",
              fieldValue,
              operator,
              value,
              fieldValue < value
            );
          }
          return fieldValue < value;

        case ">=":
          if (fieldValue < value) {
            console.log(
              "Op full : ",
              fieldValue,
              operator,
              value,
              fieldValue >= value
            );
          }
          return fieldValue >= value;

        case "<=":
          if (fieldValue > value) {
            console.log(
              "Op full : ",
              fieldValue,
              operator,
              value,
              fieldValue <= value
            );
          }
          return fieldValue <= value;
        default:
          console.log("Op full default: ", fieldValue, operator, value);
          return false;
      }
    });
  }

  const filteredData: ComputedRef<T[]> = computed(() => {
    return (store().getData as T[]).filter((e) => {
      if (!applyConditions(e, filters)) {
        return false;
      }
      return e;
    });
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
        // replace with init Callback func on the useWebSocket init

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

  function createTypedObject<U extends WebSocketDataType>(
    data: string | object
  ): U {
    const parsedData = typeof data === "string" ? JSON.parse(data) : data;
    const typedObject: Partial<U> = {};

    for (const key in parsedData) {
      const value = parsedData[key];

      if (typeof value === "string" || typeof value === "number") {
        typedObject[key as keyof U] = value as U[keyof U];
      } else if (typeof value === "object") {
        typedObject[key as keyof U] = createTypedObject(value) as U[keyof U];
      } else {
        throw new Error(`Invalid data for field ${key}`);
      }
    }
    return typedObject as U;
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

  return {
    socket,
    subscribeToSelected,
    filteredData,
    subscribe,
    currentSubscriptions,
    instrumentsToAdd,
  };
}



  // function createTypedObject<T extends WebSocketDataType>(data: string | object): T {
  //   const parsedData = typeof data === "string" ? JSON.parse(data) : data;
  //   const typedObject: Partial<T> = {};

  //   for (const key in parsedData) {
  //     const value = parsedData[key];

  //     if (typeof value === "string" || typeof value === "number") {
  //       typedObject[key as keyof T] = value as T[keyof T];
  //     } else if (typeof value === "object") {
  //       typedObject[key as keyof T] = createTypedObject<T[keyof T]>(
  //         value
  //       ) as T[keyof T];
  //     } else {
  //       throw new Error(`Invalid data for field ${key}`);
  //     }
  //   }
  //   return typedObject as T;
  // }
