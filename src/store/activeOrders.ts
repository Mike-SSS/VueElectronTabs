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

// import { createBaseStore } from "@/store/baseStore";
import { ActiveOrder as MainModel } from "@/models/marketData";
import { createBaseStore } from "./baseStore";

export const useActiveOrdersStore = createBaseStore<MainModel, {}>(
  "activeOrder",
  "activeOrderSeq",
  {
    updateEvent: updateStore,
  }
);

function updateStore(updatedItem: MainModel) {
  const store = useActiveOrdersStore();
  console.log(
    "Update active order ",
    updatedItem.activeOrderSeq,
    store.getData
  );
  const found = store.getData.value.findIndex(
    (e) => updatedItem.activeOrderSeq == e.activeOrderSeq
  );
  if (found == -1) {
    console.log("AO: Add");
    store.getData.value.push(updatedItem);
  } else {
    console.log("AO: Update");
    store.getData.value[found] = updatedItem;
  }
}
