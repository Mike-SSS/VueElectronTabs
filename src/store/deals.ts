// import { createBaseStore } from "@/store/baseStore";
// import { CompletedOrder as MainModel } from "@/models/marketData";

// const genericStore = createBaseStore<MainModel>("ActiveOrders");

// export const useActiveOrdersStore = {
//   ...genericStore,
//   actions: {
//     updateItem(updatedItem: MainModel) {
//       console.log("Custom Update active order : ", updatedItem);
//       // Add any custom logic here
//     },
//   },
// };
import { Deal as MainModel } from "@/models/marketData";
import { createBaseStore } from "./baseStore";

export const useDealsStore = createBaseStore<MainModel, {}>("deals", "dealSeq");
