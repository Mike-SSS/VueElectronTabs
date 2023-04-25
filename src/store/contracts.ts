import { createBaseStore } from "@/store/baseStore";
import { MarketDisplayItemContract  as MainModel } from "@/models/marketData";

export const useContractsStore = createBaseStore<MainModel>("market");