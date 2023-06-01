// import { createBaseStore } from "@/store/baseStore";
import { CompletedOrder as MainModel } from "@/models/marketData";
import { defineStore } from "pinia";
import { Ref, computed, ref } from "vue";
import { createBaseStore } from "./baseStore";

export const useCompletedOrdersStore = createBaseStore<MainModel, {}>("completedOrders", "clearingMember", {
    updateEvent: updateStore,
});

function updateStore (updatedItem: MainModel) {
    console.log("Update Completed order " , updatedItem.completedOrderSeq, useCompletedOrdersStore().getData);
    const found = useCompletedOrdersStore().getData.value.findIndex(e => updatedItem.completedOrderSeq == e.completedOrderSeq)
    if (found == -1) {
        console.log("CO: Add");
        useCompletedOrdersStore().getData.value.push(updatedItem);
    } else {
        console.log("CO: Update");
        useCompletedOrdersStore().getData.value[found] = updatedItem;
    }
}

// export const useCompletedOrderStore = defineStore("completedOrders", () => {
//   const data: Ref<MainModel[]> = ref([]);
//   const getData = computed(() => data);

//   function setData(items: MainModel[]) {
//     data.value = items;
//   }
//   function updateItem(updatedItem: MainModel) {
//     const temp = data.value.findIndex(
//       (e) => e.completedOrderSeq == updatedItem.completedOrderSeq
//     );

//     if (temp == -1) {
//       data.value.push(updatedItem);
//     } else {
//       data.value[temp] = updatedItem;
//     }
//   }
//   async function loadApiData() {
//     // const res = await getMarketDisplay();
//     // setData(res);
//     // console.log("Loaded market display: ", res);
//   }
//   return {
//     loadApiData,
//     getData,
//     setData,
//     updateItem,
//   };
// });
