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

export const usePositionsStore = createBaseStore<MainModel, {}>("positions", {
  updateEvent: updateStore,
});

function updateStore(updatedItem: MainModel) {
  console.log(
    "Update Position: ",
    updatedItem.positionSeq,
    usePositionsStore().getData
  );
  const found = usePositionsStore().getData.findIndex(
    (e) => updatedItem.positionSeq == e.positionSeq
  );
  if (found == -1) {
    console.log("POS: Add");
    usePositionsStore().getData.push(updatedItem);
  } else {
    console.log("POS: Update");
    usePositionsStore().getData[found] = updatedItem;
  }
}
