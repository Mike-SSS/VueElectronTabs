// Utilities
import { defineStore } from "pinia";
import { MarketDisplayItemContract as MainModel } from "@/models/marketData";
// import { createBaseStore, MyActions } from "./baseStore";
import { getMarketDisplay } from "@/utils/api";
import { computed, ComputedRef, ref, Ref } from "vue";
import { createBaseStore, MyStoreActions } from "./baseStore";
// import { CustomStore } from "@/utils/useWebsocket";

type LANGUAGE = "en" | "afr";
type THEME = "light" | "dark";

export interface MarketDisplayStoreActions extends MyStoreActions {
  loadMarketDisplay: typeof loadMarket;
}

// export const useMarketDisplayStore = createBaseStore<MainModel>(
//   "marketDisplay",
//   {
//     updateEvent: updateStore,
//   },
//   {
//     loadMarketDisplay: loadMarket,
//   }
// );

// export const useMarketDisplayStore = () => {
//   return createBaseStore<MainModel, MarketDisplayStoreActions>(
//     "marketDisplay",
//     {
//       loadMarketDisplay: loadMarket,
//     },
//     {
//       updateEvent: updateStore,
//     }
//   );
//   // console.log("Market details ", baseStore());
//   // console.log("Signature ", baseStore.prototype)
//   // return baseStore();
// };
export const useMarketDisplayStore = () => {
  const store = createBaseStore<MainModel, MarketDisplayStoreActions>(
    "marketDisplay",
    {
      updateEvent: updateStore,
    },
    {
      loadMarketDisplay: loadMarket,
    }
  );
  return store;
  // const customActions: MarketDisplayStoreActions = {
  //   loadMarketDisplay: loadMarket,
  // };
  // return {
  //   ...customActions,
  //   ...store(),
  // };
};
async function loadMarket() {
  const store = useMarketDisplayStore();
  console.log("Load Market Details");
  const res = await getMarketDisplay();
  store().setData(res);
  console.log("Market after setting: ", res, store().getData.value.length);
}

function updateStore(updatedItem: MainModel) {
  const store = useMarketDisplayStore();
  console.log("Update market: ", updatedItem.contract, store().getData);
  const found = store().getData.value.findIndex(
    (e) => updatedItem.contract == e.contract
  );
  if (found == -1) {
    console.log("AO: Add");
    store().getData.value.push(updatedItem);
  } else {
    console.log("AO: Update");
    store().getData.value[found] = updatedItem;
  }
}

// export const useMarketDisplayStore = defineStore("marketDisplay", () => {
//   const data: Ref<MainModel[]> = ref([]);
//   const getData = computed(() => data);

//   function setData(items: MainModel[]) {
//     data.value = items;
//   }
//   function updateItem(updatedItem: MainModel) {
//     const temp = data.value.findIndex(
//       (e) => e.contract == updatedItem.contract
//     );

//     if (temp == -1) {
//       data.value.push(updatedItem);
//     } else {
//       data.value[temp] = updatedItem;
//     }
//   }
//   async function loadApiData() {
//     const res = await getMarketDisplay();
//     setData(res);
//     console.log("Loaded market display: ", res);
//   }
//   return {
//     loadApiData,
//     getData,
//     setData,
//     updateItem,
//   };
// });

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
