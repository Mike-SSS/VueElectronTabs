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
import {
  PublishAll,
  MarketDisplayItemContract,
  FilterCondition,
  ActiveOrder,
  CompletedOrder,
  MarketDisplayItemPosition,
  Deal,
} from "@/models/marketData";

import { createBaseStore } from "@/store/baseStore";
import { CustomActiveOrderActions } from "@/store/customActiveOrders";
export type CommonStore<T extends WebSocketDataType, U = {}> = ReturnType<
  typeof createBaseStore<T>
> &
  U;
export type CustomStore<T extends WebSocketDataType, U> = CommonStore<T> & {
  [K in keyof U]: U[K];
};

type WebSocketDataType =
  | MarketDisplayItemContract
  | MarketDisplayItemPosition
  | Deal
  | ActiveOrder
  | CompletedOrder;

export function useWebSocket<T extends WebSocketDataType, U = {}>(
  store: ReturnType<typeof createBaseStore<T, U>>,
  url: string,
  filters: FilterCondition[],
  updateEvent: {
    name: string;
    func: (message: string) => void;
  },
  onConnect?: () => Promise<void> | void
): {
  socket: Ref<HubConnection | null>;
  typedArray: <U extends WebSocketDataType>(data: string | object[]) => U[];
  filteredData: ComputedRef<T[]>;
  subscribeToSelected: () => boolean;
  subscribe: (list: string[]) => Promise<boolean>;
} {
  const subsToAdd = ref<T[]>([]);
  const socket = ref<HubConnection | null>(null) as Ref<HubConnection | null>;
  const subscriptions = ref<T[]>([]);
  const openInstruments = ref(false);

  const currentSubscriptions = computed(() => subscriptions.value);
  const instrumentsToAdd = computed(() => subsToAdd.value);

  onMounted(() => {
    connect(url, () => {
      console.log("Callback on connect for socket connection");
    });
  });

  onUnmounted(() => {
    disconnect(url);
  });
  const subscribeToSelected = () => {
    try {
      console.log("Subscribing to : ", instrumentsToAdd);
      subscribe(instrumentsToAdd.value.map((e) => e.contract));
      instrumentsToAdd.value.forEach((e) => {
        // currentSubscriptions.value.push(e);
      });
      instrumentsToAdd.value.splice(0);
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
              "== full : ",
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
              "!== full : ",
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
              "> full : ",
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
              "< full : ",
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
    return store().getData.filter((e) => {
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

  const connect = async (endpoint: string, onSocketConnected: () => void) => {
    console.log("Attempt to connect");

    // signalrStore.connect(endpoint);
    socket.value = new HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_APP_API_URL}${endpoint}`)
      .withAutomaticReconnect()
      .build();

    socket.value.on("connected", (message: string) => {
      console.log("Socket connected ", message, socket.value?.connectionId);
    });

    socket.value.on("message", (message: string) => {
      console.log("Socket message ", message);
    });
    socket.value.on("marketInit", (message: string) => {
      console.log("Market init message ", message);
    });
    socket.value.on("MarketInit", (message: string) => {
      console.log("Market INIT ");
      try {
        const temp = createTypedArray<T>(message);
        console.log("Parsed update : ", temp);
        store().initData(temp);
        // store().updateItem(temp);
      } catch (err) {
        console.error("error parsing OPTION MARKET UPDATE for ", message, err);
      }
    });
    socket.value.on("MarketDisplay", (message: string) => {
      console.log("Market Display Update ");
      try {
        const temp = createTypedArray<T>(message);
        temp.forEach((e) => {
          store().updateItem(e);
        });
        console.log("Parsed update : ", temp);
        //
      } catch (err) {
        console.error("error parsing OPTION MARKET UPDATE for ", message, err);
      }
    });
    socket.value.on(updateEvent.name, updateEvent.func);

    await socket.value
      .start()
      .then(async () => {
        // init data here for each panel
        // replace with init Callback func on the useWebSocket init
        console.log("Waiting before socket ");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Socket connected here");
        if (socket.value) {
          if (onConnect) {
            console.log("OnConnect exists");
            await onConnect();
          }
        }
      })
      .catch((err) => {
        console.error("Error starting socket ", err);
      });
  };
  function createTypedArray<U extends WebSocketDataType>(
    data: string | object[]
  ): U[] {
    console.log("Create typed array");
    const parsedData = typeof data === "string" ? JSON.parse(data) : data;

    if (!Array.isArray(parsedData)) {
      // throw new Error("Input data must be an array.");
      // parsedData = [parsedData]
      return [createTypedObject<U>(parsedData)];
    }

    return parsedData.map((item) => createTypedObject<U>(item));
  }
  function pascalToCamel(str: string): string {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, "");
  }
  function getTypeGuard(obj: any): ((data: any) => boolean) | null {
    // if (isMarketDisplayItemContract(obj)) {
    //   return isMarketDisplayItemContract;
    // }

    // if (isMarketDisplayItemPosition(obj)) {
    //   return isMarketDisplayItemPosition;
    // }

    // Add more type guards for remaining types

    return null;
  }
  function createTypedObject<U extends WebSocketDataType>(
    data: Record<string, unknown>
  ): U {
    console.log("Create typed object");
    const exampleInstance = {} as U;
    // const typeGuard = getTypeGuard(exampleInstance);
    // if (!typeGuard) {
    //   throw new Error("No type guard found for the expected type");
    // }

    // if (!typeGuard(data)) {
    //   throw new Error("Invalid data structure for the expected type");
    // }

    const typedObject: Partial<U> = {};

    for (const key in data) {
      const camelKey = pascalToCamel(key);
      const value = data[key];

      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        typedObject[camelKey as keyof U] = value as U[keyof U];
      } else if (typeof value === "object" && value !== null) {
        typedObject[camelKey as keyof U] = createTypedObject(
          value as Record<string, unknown>
        ) as U[keyof U];
      } else {
        throw new Error(`Invalid data for field ${key} ${camelKey} ${value}`);
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
    typedArray: createTypedArray,
    // openInstruments,
    subscribe,
    // currentSubscriptions,
    // instrumentsToAdd,
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
