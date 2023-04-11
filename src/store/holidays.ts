// Utilities
import { defineStore } from "pinia";
import { MarketDisplayItemHoliday } from "@/models/marketData";

interface State {
  marketDisplayData: MarketDisplayItemHoliday[];
}

export const useHolidaysStore = defineStore("holidays", {
  state: (): State => ({
    marketDisplayData: [],   
  }),
  actions: {
    setMarketDisplayData(items: MarketDisplayItemHoliday[]) {
      this.marketDisplayData = items;
    },
  },

  getters: {
    getMarketDisplayData: (state) => state.marketDisplayData,
  },
});
