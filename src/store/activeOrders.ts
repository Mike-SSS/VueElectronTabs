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
import { ActiveOrder as MainModel } from "@/models/marketData";

export const useActiveOrdersStore = createBaseStore<MainModel>("activeOrder", {
    updateEvent: updateStore
});


function updateStore (updatedItem: MainModel) {
    console.log("Update active order " , updatedItem.activeOrderSeq, useActiveOrdersStore().getData);
    const found = useActiveOrdersStore().getData.findIndex(e => updatedItem.activeOrderSeq == e.activeOrderSeq)
    if (found == -1) {
        console.log("AO: Add");
        useActiveOrdersStore().getData.push(updatedItem);
    } else {
        console.log("AO: Update");
        useActiveOrdersStore().getData[found] = updatedItem;
    }

}