// Utilities
import { defineStore } from "pinia";
import { MarketDisplayItemActiveOrder } from "@/models/marketData";

interface State {
  marketDisplayData: MarketDisplayItemActiveOrder[];
}

export const useOrdersStore = defineStore("orders", {
  state: (): State => ({
    marketDisplayData: [],   
  }),
  actions: {
    setMarketDisplayData(items: MarketDisplayItemActiveOrder[]) {
      this.marketDisplayData = items;
    },
  },

  getters: {
    getData: (state) => state.marketDisplayData,
  },
});
