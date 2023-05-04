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
      const temp = data.value.findIndex((e) => e == updatedItem);
      if (temp == -1) {
        data.value.push(updatedItem);
      }
      else {
        data.value[temp] = updatedItem;
      }
    }
    function initData(arr: T[]) {
      console.log("Init data: ", arr.length, data.value.length);
      data.value = arr;
    }
    const getData = computed(() => data.value);

    return { getData, updateItem, setData, initData, ...customActions };
  });
}