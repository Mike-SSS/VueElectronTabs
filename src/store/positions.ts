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

import { createBaseStore } from "@/store/baseStore";
import { MarketDisplayItemPosition as MainModel } from "@/models/marketData";

export const usePositionsStore = createBaseStore<MainModel>("positions");