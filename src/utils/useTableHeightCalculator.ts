import { computed, onMounted, ref, onBeforeUnmount } from "vue";

export function useTableHeightCalculator() {
  const Reference = ref();
  const tableHeight = ref(0);
  const onWindowResize = () => {
    tableHeight.value = calculateTableHeight.value;
  };
  onMounted(() => {
    console.log("Mounted Futures ");
    onWindowResize();
    window.addEventListener("resize", onWindowResize);
  });
  onBeforeUnmount(() => {
    window.removeEventListener("resize", onWindowResize);
  });

  // Uses 'Reference' ref in component to identify. expose in return
  const calculateTableHeight = computed(() => {
    console.log("Reference: ", Reference.value);
    if (Reference && Reference.value) {
      const col = Reference.value.$el as HTMLElement;
      const height = col.clientHeight;
      console.log("Height :", height, col.clientHeight, col);
      // return height;
      const header = col.querySelector("thead") as HTMLElement;
      const pagination = col.querySelector(
        ".v-data-table-footer"
      ) as HTMLElement;
      console.log("Check: ", header, pagination);
      const paginationHeight = pagination ? pagination.offsetHeight : 0;

      const result = height - paginationHeight - 20;
      console.log("Returned height: ", result, paginationHeight);
      tableHeight.value = result;
      return result;
    } else {
        tableHeight.value = 0;
      return 0;
    }
  });

  return { calculateTableHeight, Reference };
}
