// Utilities
import { defineStore } from "pinia";
import { MarketDisplayItem } from "./signalr";

type LANGUAGE = "en" | "afr";
type THEME = "light" | "dark";

interface State {
  marketDisplayData: MarketDisplayItem[];
}

export const useMarketDisplayStore = defineStore("marketDisplay", {
  state: (): State => ({
    marketDisplayData: [],
  }),
  actions: {
    setMarketDisplayData(items: MarketDisplayItem[]) {
      this.marketDisplayData = items;
    },
    updateItem(updatedItem: MarketDisplayItem) {
      const currentItem = this.marketDisplayData.find(
        (e) => e.contract == updatedItem.contract
      );
      if (currentItem) {
        // found
        for (const key in currentItem) {
          if (
            currentItem.hasOwnProperty(key) &&
            currentItem[key as keyof MarketDisplayItem] !==
              updatedItem[key as keyof MarketDisplayItem]
          ) {
            currentItem[key as keyof MarketDisplayItem] = updatedItem[key as keyof MarketDisplayItem];
          }
        }
      } else {
        // not found -> add
        this.marketDisplayData.push(updatedItem);
      }
    },
  },

  getters: {
    getMarketDisplayData: (state) => state.marketDisplayData,
  },
});
