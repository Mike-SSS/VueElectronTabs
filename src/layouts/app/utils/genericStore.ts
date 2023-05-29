// utils/genericStore.ts
import { defineStore, } from "pinia";
import { ShallowRef } from "vue";
import { Ref, shallowRef, ref,computed } from "vue";

interface State<T> {
  data: Ref<T[]>;
}
interface CustomActions<T> {
  [key: string]: (payload: T) => void;
}

export function createGenericStore<T>(
  storeId: string,
  customActions: CustomActions<T> = {}
) {
  const store = defineStore(storeId, () => {
    const data = ref([]) as Ref<T[]>;
    function setData(items: T[]) {
        data.value = items;
      }
      function updateItem(updatedItem: T) {
        console.log("Update item: ", updatedItem);
      }
      const getData = computed(() => data.value);

      return { getData, updateItem, setData }
    }
);
  return store;
}
