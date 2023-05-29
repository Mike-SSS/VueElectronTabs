import { defineStore } from "pinia";
import { ActiveOrder as MainModel } from "@/models/marketData";
import { BasicStore, MyStoreActions, createBaseStore } from "./baseStore";
import { computed } from "vue";
import { useActiveOrdersStore } from "./activeOrders";
// import { CustomStore } from "@/utils/useWebsocket";

export interface CustomActiveOrderActions extends MyStoreActions {
  customAction: () => void;
}
// export const useCustomActiveOrdersStore = createBaseStore<MainModel>("activeOrder");
// export const useCustomActiveOrdersStore = createBaseStore<MainModel, {}>("activeOrder", undefined,customActions);

// export const useCustomActiveOrderStore = () => {
//   const baseStore = createBaseStore<MainModel>("customActiveOrder");
//   const { updateItem, setData, getData, $id } = baseStore();
//   const customActions: CustomActiveOrderActions = {
//     async customAction() {
//       console.log("Load custom action");
//     },
//     // ... other custom actions
//   };
//   return {
//     $id,
//     updateItem,
//     setData,
//     getData,
//     ...customActions,
//   };
// };

export const useCustomActiveOrderStore = () => {
  const customActions: CustomActiveOrderActions = {
    customAction: () => {
      console.log("Trust");
      // Your implementation here
    },
  };
  const store = createBaseStore<MainModel, CustomActiveOrderActions>(
    "customActiveOrder",
    {
      updateEvent: updateStore,
    },
    {
      customAction: customActions.customAction,
    }
  );
    return store;
  // return {
  //   ...store(),
  //   ...customActions,
  // };
  // return {
  //   // ...customActions,
  //   ...store(),

  // };
  // console.log("Market details ", baseStore());
  // console.log("Signature ", baseStore.prototype)
  // return baseStore();
};
// export const useCustomActiveOrderStore = () (
//   "customActiveOrder",
//   () => {
//     // const baseStore = createBaseStore<MainModel>("customActiveOrder");
//     // const { updateItem, setData, getData } = baseStore();
//     // const t = computed(() => getData);
//     // const customActions: CustomActiveOrderActions = {
//     //   async customAction() {
//     //     console.log("Load custom action");
//     //   },
//     //   // ... other custom actions
//     // };
//     const customActions: CustomActiveOrderActions = {
//       async customAction() {
//         console.log("Load custom action");
//       },
//       // ... other custom actions
//     };
//     return createBaseStore<MainModel, CustomActiveOrderActions>(
//       "customActiveOrder",
//       {
//         updateEvent: updateStore
//       },
//       customActions
//     );
//   }
// );
function updateStore(updatedItem: MainModel) {
  const store = useCustomActiveOrderStore()();
  const store2 = useActiveOrdersStore();
  console.log(
    "Update market: ",
    updatedItem.contract,
    store.getData,
    store2.getData
  );
  const found = store.getData.value.findIndex(
    (e) => updatedItem.contract == e.contract
  );
  if (found == -1) {
    console.log("AO: Add");
    store.getData.value.push(updatedItem);
  } else {
    console.log("AO: Update");
    store.getData.value[found] = updatedItem;
  }
}
