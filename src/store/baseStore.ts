import { Store, StoreActions, defineStore } from "pinia";
import { Ref, ref, computed, ComputedRef } from "vue";
import { MarketDisplayItemContract as MainModel } from "@/models/marketData";
import { CustomActions } from "@/utils/useWebsocket";
import { MarketDisplayStoreActions } from "./marketDisplay";
import { CustomActiveOrderActions } from "./customActiveOrders";
// export interface MyActions {
//   [action: string]: (...args: any[]) => any;
// }

// type CustomActions<U extends MyActions = {}> = {
//   [K in keyof U]: U[K];
// };

// export function createBaseStore<T, U extends MyActions = {}>(
//   name: string,
//   baseFunc?: {
//     updateEvent: ((updatedItem: T) => void) | undefined;
//   },
//   customActions?: U
// ) {
//   const { updateEvent } = baseFunc || {};
//   const store = defineStore(name, {
//     state: (): {
//       data: Ref<T[]>;
//     } => ({
//       data: ref([]),
//     }),
//     getters: {
//       getData(): T[] {
//         return this.data;
//       },
//     },
//     actions: {
//       ...(customActions as U),
//       setData(items: T[]) {
//         this.data = items;
//       },
//       updateItem(updatedItem: T) {
//         if (updateEvent) {
//           console.log("Custom item update: ", updatedItem);
//           updateEvent(updatedItem);
//           return;
//         }

//         console.log("Update item: ", updatedItem);
//         const temp = this.data.findIndex((e) => e == updatedItem);

//         if (temp == -1) {
//           this.data.push(updatedItem);
//         } else {
//           this.data[temp] = updatedItem;
//         }
//       },
//       initData(arr: T[]) {
//         console.log("Init data: ", arr.length, this.data.length);
//         this.data = arr;
//       },
//     },
//   });
//   return store;
// }

export interface BasicStore<T> {
  setData: (items: T[]) => void;
  getData: ComputedRef<Ref<T[]>>;
  updateItem: (updatedItem: T) => void;
}
export type MyStoreActions = {
  [key: string]: (...args: any[]) => Promise<void> | void;
  // [K in keyof T]: () => T[K];
};
export type CustomAction = MarketDisplayStoreActions | CustomActiveOrderActions;

export type MyStoreGetters = {
  [key: string]: ComputedRef<any>;
};
export function createBaseStore<T, CustomAction>(
  name: string,
  baseFunc?: {
    updateEvent: ((updatedItem: T) => void) | undefined;
  },
  customActions?: CustomAction
) {
  const { updateEvent } = baseFunc || {};
  console.log("Custom Actinos :", customActions);
  const store = defineStore(name, () => {
    const data = ref([]) as Ref<T[]>;
    const getData = computed(() => data);

    function setData(items: T[]) {
      console.log("Set data ", items.length);
      data.value = items;
    }
    function updateItem(updatedItem: T) {
      if (updateEvent) {
        console.log("Custom item update: ", updatedItem);
        updateEvent(updatedItem);
        return;
      }

      console.log("Update item: ", updatedItem);
      const temp = data.value.findIndex((e) => e == updatedItem);

      if (temp == -1) {
        data.value.push(updatedItem);
      } else {
        data.value[temp] = updatedItem;
      }
    }
    if (typeof customActions == "object" && customActions != null) {
      console.log("Whoop base with custom!!!", customActions);
      return {
        getData,
        setData,
        updateItem,
        customActions: {
          customActions,
          test: () => {
            console.log("Yolo");
          },
        },
      };
    } else {
      return {
        getData,
        setData,
        updateItem,
        customActions: {
          test: () => {
            console.log("Yolo");
          },
        },
      };
    }
  });
  return store;
  // console.log("Base  : ", name, " - ", { ...customActions });
  // const temp = customActions ? customActions : {};
  // if (customActions) {
  //   customActions
  // }
  // // const customAcc = customActions;

  // const { updateEvent } = baseFunc || {};
  // const store = defineStore(name, {
  //   state: () => ({
  //     data: ref([]) as Ref<T[]>,
  //   }),
  //   getters: {
  //     getData(): T[] {
  //       return this.data;
  //     },
  //   },
  //   actions: {
  //     customActions,
  //     setData(items: T[]) {
  //       this.data = items;
  //     },
  //     updateItem(updatedItem: T) {
  //       if (updateEvent) {
  //         console.log("Custom item update: ", updatedItem);
  //         updateEvent(updatedItem);
  //         return;
  //       }

  //       console.log("Update item: ", updatedItem);
  //       const temp = this.data.findIndex((e) => e == updatedItem);

  //       if (temp == -1) {
  //         this.data.push(updatedItem);
  //       } else {
  //         this.data[temp] = updatedItem;
  //       }
  //     },
  //   },
  // });
  // return store;
}
// const store = defineStore(name, (): BasicStore<T> => {
//   const data = ref([]) as Ref<T[]>;

//   const getData = computed(() => data);

//   function setData(items: T[]) {
//     data.value = items;
//   }
//   function updateItem(updatedItem: T) {
//     if (updateEvent) {
//       console.log("Custom item update: ", updatedItem);
//       updateEvent(updatedItem);
//       return;
//     }

//     console.log("Update item: ", updatedItem);
//     const temp = data.value.findIndex((e) => e == updatedItem);

//     if (temp == -1) {
//       data.value.push(updatedItem);
//     } else {
//       data.value[temp] = updatedItem;
//     }
//   }

//   return {
//     setData,
//     getData,
//     updateItem,
//     ...customActions,
//   };
// return basicStore;
// If customActions is provided, combine the types of your base store and customActions
// Otherwise, just return your base store
// const actions = customActions
//   ? ({
//       ...basicStore,
//       ...(customActions as Record<keyof U, any>),
//     } as BasicStore<T> & U)
//   : (basicStore as BasicStore<T> & U);
// console.log("Base store ", customActions, actions);
// return actions;

// if (customActions != undefined) {
//   console.log("Add custom actions ", customActions);
//   return {
//     setData,
//     getData,
//     updateItem,
//     ...(customActions as U),
//   };
// } else {
//   return {
//     setData,
//     getData,
//     updateItem,
//     // ...(
//   };
// }
// const baseActions = {
//   setData,
//   getData,
//   updateItem,
// };

// // Define a type for your base store
// type BaseStoreType = typeof baseActions;

// // If customActions is provided, combine the types of your base store and customActions
// // Otherwise, just return your base store
// const actions: BaseStoreType & U = customActions
//   ? { ...baseActions, ...customActions }
//   : baseActions;

// return actions;
//   });
//   return store;
// }

// export function createBaseStore<T, U extends MyActions = {}>(
//   name: string,
//   baseFunc?: {
//     updateEvent: ((updatedItem: T) => void) | undefined;
//   },
//   customActions?: U
// ) {
//   const { updateEvent } = baseFunc || {};

//   const store = defineStore(name, () => {
//     const data = ref([]) as Ref<T[]>;

//     function setData(items: T[]) {
//       data.value = items;
//     }

//     function updateItem(updatedItem: T) {
//       if (updateEvent) {
//         console.log("Custom item update: ", updatedItem);
//         updateEvent(updatedItem);
//         return;
//       }

//       console.log("Update item: ", updatedItem);
//       const temp = data.value.findIndex((e) => e == updatedItem);

//       if (temp == -1) {
//         data.value.push(updatedItem);
//       } else {
//         data.value[temp] = updatedItem;
//       }
//     }

//     function initData(arr: T[]) {
//       console.log("Init data: ", arr.length, data.value.length);
//       data.value = arr;
//     }

//     const getData = computed(() => data.value);

//     const baseStore: BaseStore<T> = {
//       data,
//       setData,
//       updateItem,
//       initData,
//       getData,
//     };

//     return {
//       ...baseStore,
//       ...(customActions as U),
//     };
//   });

//   return store;
// }

///
// import { Store, defineStore } from "pinia";
// import { Ref, ref, computed, ComputedRef } from "vue";
// export interface MyActions {
//   [action: string]: (...args: any[]) => any;
// }
// // This interface will define your base properties and actions.
// interface BaseStore<T> {
//   data: Ref<T[]>;
//   setData: (items: T[]) => void;
//   updateItem: (updatedItem: T) => void;
//   initData: (arr: T[]) => void;
// }
// // This will be the type for your custom actions.
// type CustomActions<U extends MyActions = {}> = {
//   [K in keyof U]: U[K];
// };
// type StoreWithCustomActions<T, U extends MyActions = {}> = BaseStore<T> &
//   CustomActions<U>;
// export function createBaseStore<T, U extends MyActions>(
//   name: string,
//   baseFunc?: {
//     updateEvent: ((updatedItem: T) => void) | undefined;
//   },
//   customActions?: U
// ) {
//   return defineStore(name, (): StoreWithCustomActions<T, U> => {
//     const data = ref([]) as Ref<T[]>;
//     function setData(items: T[]) {
//       data.value = items;
//     }
//     function findItem(lookFor: T, identifier: string) {
//       return data.value.find(
//         (e) => e[identifier as keyof T] == lookFor[identifier as keyof T]
//       );
//     }
//     function updateItem(updatedItem: T) {
//       if (baseFunc && baseFunc.updateEvent) {
//         console.log("Custom item update: ", updatedItem);
//         return baseFunc.updateEvent(updatedItem);
//       }
//       console.log("Update item: ", updatedItem);
//       const temp = data.value.findIndex((e) => e == updatedItem);
//       if (temp == -1) {
//         data.value.push(updatedItem);
//       } else {
//         data.value[temp] = updatedItem;
//       }
//     }
//     function initData(arr: T[]) {
//       console.log("Init data: ", arr.length, data.value.length);
//       data.value = arr;
//     }
//     const getData = computed(() => data.value);
//     console.log("Base store ", customActions, initData);
//     const baseStore: BaseStore<T> = {
//       data,
//       setData,
//       updateItem,
//       initData,
//     };

//     if (customActions) {
//       return {
//         ...baseStore,
//         ...(customActions as U),
//       };
//     } else {
//       return baseStore;
//     }
//   });
// }
