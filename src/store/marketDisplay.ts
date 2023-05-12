// Utilities
import { defineStore } from "pinia";
import { MarketDisplayItemContract as MainModel } from "@/models/marketData";
import { createBaseStore } from "./baseStore";

type LANGUAGE = "en" | "afr";
type THEME = "light" | "dark";

interface State {
  marketDisplayData: MainModel[];
}
export const useMarketDisplayStore = createBaseStore<MainModel>(
  "marketDisplay",
  {
    updateEvent: updateStore,
  }
);

function updateStore(updatedItem: MainModel) {
  console.log(
    "Update market: ",
    updatedItem.contract,
    useMarketDisplayStore().getData
  );
  const found = useMarketDisplayStore().getData.findIndex(
    (e) => updatedItem.contract == e.contract
  );
  if (found == -1) {
    console.log("AO: Add");
    useMarketDisplayStore().getData.push(updatedItem);
  } else {
    console.log("AO: Update");
    useMarketDisplayStore().getData[found] = updatedItem;
  }
}
// export const useMarketDisplayStore = defineStore("marketDisplay", {
//   state: (): State => ({
//     marketDisplayData: [],
//   }),
//   actions: {
//     setData(items: Model[]) {
//       this.marketDisplayData = items;
//     },
//     updateItem(updatedItem: Model) {
//       const currentItem = this.marketDisplayData.find(
//         (e) => e.contract == updatedItem.contract
//       );
//       if (currentItem) {
//         // found
//         for (const key in currentItem) {
//           if (
//             currentItem.hasOwnProperty(key) &&
//             currentItem[key as keyof Model] !==
//               updatedItem[key as keyof Model]
//           ) {
//             const temp = updatedItem[key as keyof Model];
//             currentItem[key as keyof Model] = temp;
//           }
//         }
//       } else {
//         // not found -> add
//         this.marketDisplayData.push(updatedItem);
//       }
//     },
//   },

//   getters: {
//     getData: (state) => state.marketDisplayData,
//   },
// });
