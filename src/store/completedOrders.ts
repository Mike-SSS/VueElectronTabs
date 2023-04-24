import { createBaseStore } from "@/store/baseStore";
import { CompletedOrder as MainModel } from "@/models/marketData";

export const useCompletedOrdersStore = createBaseStore<MainModel>("completedOrders");