import { defineStore } from "pinia";
import { Ref, ref, computed } from "vue";

export function createBaseStore<T, U = {}>(name: string, customActions?: U) {
  return defineStore(name, () => {
    const data = ref([]) as Ref<T[]>;
    function setData(items: T[]) {
      data.value = items;
    }
    function updateItem(updatedItem: T) {
      console.log("Update item: ", updatedItem);
    }
    const getData = computed(() => data.value);

    return { getData, updateItem, setData, ...customActions };
  });
}