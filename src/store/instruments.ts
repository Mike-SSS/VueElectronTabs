// Utilities
import { defineStore } from "pinia";
import { MarketDisplayItemInstrument } from "@/models/marketData";

interface State {
  marketDisplayData: MarketDisplayItemInstrument[];
}

export const useInstrumentsStore = defineStore("instruments", {
  state: (): State => ({
    marketDisplayData: [],   
  }),
  actions: {
    setMarketDisplayData(items: MarketDisplayItemInstrument[]) {
      this.marketDisplayData = items;
    },
  },

  getters: {
    getData: (state) => state.marketDisplayData,
  },
});
