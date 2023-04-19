// Utilities
import { defineStore } from "pinia";
import { MarketDisplayItemContract as Model } from "@/models/marketData";

interface State {
  marketDisplayData: Model[];
}

export const useContractsStore = defineStore("contracts", {
  state: (): State => ({
    marketDisplayData: [],
  }),
  actions: {
    setData(items: Model[]) {
      this.marketDisplayData = items;
    },
    updateItem(updatedItem: Model) {
      const currentItem = this.marketDisplayData.find(
        (e) => e.contract == updatedItem.contract
      );
      if (currentItem) {
        // found
        for (const key in currentItem) {
          if (
            currentItem.hasOwnProperty(key) &&
            currentItem[key as keyof Model] !==
              updatedItem[key as keyof Model]
          ) {
            const temp = updatedItem[key as keyof Model];
            currentItem[key as keyof Model] = temp;
          }
        }
      } else {
        // not found -> add
        this.marketDisplayData.push(updatedItem);
      }
    },
  },

  getters: {
    getData: (state) => state.marketDisplayData,
  },
});
