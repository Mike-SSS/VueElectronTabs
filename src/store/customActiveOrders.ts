import { defineStore } from "pinia";
import { ActiveOrder as MainModel  } from "@/models/marketData";
import { createBaseStore } from "./baseStore";
import { CustomStore } from "@/utils/useWebsocket";

export interface CustomActiveOrderActions {
  customAction: (entity: MainModel) => void;
}

const baseStore = createBaseStore<MainModel>("customActiveOrder");

const customActions: CustomActiveOrderActions = {
  customAction(entity: MainModel) {
    // your custom action logic
  },
};

export const useCustomActiveOrdersStore = createBaseStore<MainModel, typeof customActions>("activeOrder", customActions);

// export function useCustomActiveOrderStore(): CustomStore<ActiveOrder, CustomActiveOrderActions> {
//   const storeInstance = baseStore();
//   const storeWithCustomActions: CustomStore<ActiveOrder, CustomActiveOrderActions> = {
//     ...storeInstance,
//     ...customActions,
//   };
//   return storeWithCustomActions;
// }