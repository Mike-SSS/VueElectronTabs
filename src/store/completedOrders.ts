import { createBaseStore } from "@/store/baseStore";
import { CompletedOrder as MainModel } from "@/models/marketData";

export const useCompletedOrdersStore = createBaseStore<MainModel>("completedOrders", {
    updateEvent: updateStore,
});

function updateStore (updatedItem: MainModel) {
    console.log("Update Completed order " , updatedItem.completedOrderSeq, useCompletedOrdersStore().getData);
    const found = useCompletedOrdersStore().getData.findIndex(e => updatedItem.completedOrderSeq == e.completedOrderSeq)
    if (found == -1) {
        console.log("CO: Add");
        useCompletedOrdersStore().getData.push(updatedItem);
    } else {
        console.log("CO: Update");
        useCompletedOrdersStore().getData[found] = updatedItem;
    }
}