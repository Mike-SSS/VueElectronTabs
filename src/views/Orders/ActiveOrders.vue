<template>
  <v-container fluid :style="props.style" class="bg-grey d-flex flex-column">
    <CommonToolbar
      :socket-state="socket?.state"
      :class="props.class"
      :close-component="closeComponent"
      :data-length="filteredData.length"
      :action-buttons="actionButtons"
      title="Active Orders"
      tooltip="This is more information on active order. Example description. All active orders below"
    ></CommonToolbar>
    <v-row class="fill-height">
      <v-col cols="12" class="pa-0 fill-height" ref="Reference">
        <v-data-table
          v-model="state.selectedRows"
          return-object
          density="compact"
          :items="filteredData"
          item-value="activeOrderSeq"
          item-title="activeOrderSeq"
          :headers="getSortedHeaders"
          :height="calculateTableHeight"
          fixed-header
          show-select
          @click:row="onRowClicked"
          :items-per-page="-1"
        >
          <template v-slot:group-header="{ item, columns, toggleGroup }">
            <tr :id="'group_' + item.value">
              <td :colspan="columns.length" class="text-start">
                <v-btn
                  size="small"
                  variant="text"
                  @click="toggleGroup(item)"
                ></v-btn>
                {{ item.value }}
              </td>
            </tr>
          </template>
          <template #item.quantity="{ item }">
            <v-menu
              :open-delay="10"
              v-if="itemStates[item.raw.activeOrderSeq]"
              :close-delay="0"
              :open-on-hover="true"
              :close-on-content-click="false"
              v-model="itemStates[item.raw.activeOrderSeq].isOpen"
              location="end"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  @click.stop.prevent
                  color="primary"
                  variant="text"
                  v-bind="props"
                >
                  {{ item.columns.quantity }}
                </v-btn>
              </template>

              <v-card min-width="300">
                <v-card-title> Reduce Order </v-card-title>
                <v-card-text class="pb-1">
                  <v-text-field
                    hide-details="auto"
                    type="number"
                    label="QTY"
                  ></v-text-field>
                  <v-switch
                    hide-details
                    color="primary"
                    label="Apply to all rows selected?"
                  ></v-switch>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    variant="text"
                    @click="itemStates[item.raw.activeOrderSeq].isOpen = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    color="primary"
                    variant="text"
                    @click="itemStates[item.raw.activeOrderSeq].isOpen = false"
                  >
                    Submit
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
          </template>
          <template
            v-slot:item.data-table-select="{ item, toggleSelect, isSelected }"
          >
            <v-checkbox-btn
              style="font-size: 0.5rem"
              color="primary"
              :disabled="
                state.selectedRows.length >= 2 &&
                state.selectedRows.find(
                  (e) => e.activeOrderSeq == item.value.activeOrderSeq
                ) == null
              "
              :model-value="isSelected([item])"
              @click.stop.prevent="() => toggleSelect(item)"
            ></v-checkbox-btn>
          </template>
          <template #bottom></template>
        </v-data-table>
      </v-col>
    </v-row>
    <!-- <EditOrder
      v-model="dialogs.editOrder"
      :socket="socket ? socket : undefined"
      :item="state.selectedRows[0]"
    ></EditOrder>
    <DeleteOrder
      v-model="dialogs.deleteOrder"
      :socket="socket ? socket : undefined"
      :item="state.selectedRows[0]"
    ></DeleteOrder> -->
    <SuspendOrder
      v-model="dialogs.suspendOrder"
      :socket="socket"
      :item="state.selectedRows[0]"
    ></SuspendOrder>
    <!-- <SuspendAll
      v-model="dialogs.suspendAll"
      :socket="socket ? socket : undefined"
      :items="filteredData"
    ></SuspendAll> -->
    <!-- <DeleteAll
      v-model="dialogs.deleteAll"
      :socket="socket ? socket : undefined"
      :items="filteredData"
    ></DeleteAll> -->
    <HeaderPicker
      v-model="state.openHeaderPicker"
      v-model:tableHeaders.sync="headers"
      v-model:selectedHeaders.sync="state.selectedHeaders"
    ></HeaderPicker>
  </v-container>
</template>

<script lang="ts" setup>
import {
  computed,
  ref,
  watch,
  reactive,
  onMounted,
  onBeforeUnmount,
} from "vue";
import { useLayoutStore } from "@/store/layout";
import HeaderPicker from "@/components/HeaderPicker.vue";
import { useAppStore } from "@/store/app";
// import { useContractsStore } from "@/store/contracts";
import { useActiveOrdersStore } from "@/store/activeOrders";
import {
  CustomActiveOrderActions,
  useCustomActiveOrderStore,
} from "@/store/customActiveOrders";

import CommonToolbar from "@/components/CommonToolbar.vue";
import DeleteOrder from "@/components/ActiveOrderModals/DeleteOrder.vue";
import EditOrder from "@/components/ActiveOrderModals/EditOrder.vue";
import SuspendOrder from "@/components/ActiveOrderModals/SuspendOrder.vue";
import SuspendAll from "@/components/ActiveOrderModals/SuspendAll.vue";
import DeleteAll from "@/components/ActiveOrderModals/DeleteAll.vue";

import DynamicToolbarActionsHandler from "@/components/DynamicToolbarActions.vue";
// import {
//   CustomActiveOrderActions,
//   useCustomActiveOrdersStore,
// } from "@/store/activeOrders";
import { useTableHeightCalculator } from "@/utils/useTableHeightCalculator";

import { useWebSocket } from "@/utils/useWebsocket";
import {
  FilterCondition,
  ActiveOrder as MainModel,
  PublishAll,
} from "@/models/marketData";
import { noAuthInstance } from "@/plugins/axios";
import { useCommonComponentFunctions } from "@/utils/commonComponentFunctions";
import CloseComponentButton from "@/components/CloseComponentButton.vue";
import { ActionButton } from "@/models/UI";
// import { MarketDisplayStoreActions } from "@/store/marketDisplay";

interface TableItem {
  _open: boolean;
  _groupKey: string;
  items: TableItem[] | MainModel[];
}
const appStore = useAppStore();
const mainStore = useCustomActiveOrderStore();
// const mainStore = useActiveOrdersStore();
// const tStore = useActiveOrdersStore();

const { calculateTableHeight, Reference } = useTableHeightCalculator();

const headers: any[] = [
  // { title: "Contract", key: "contract", align: "start" },
  { title: "Enter Time", key: "enterTime" },
  {
    title: "Date",
    key: "contractDisplay.contractDate",
  },
  {
    title: "Instrument",
    key: "contractDisplay.instrument",
  },
  { title: "Price", key: "rate" },
  { title: "Strike", key: "contractDisplay.strike" },
  { title: "Principal", key: "principal" },
  { title: "Sub Acc", key: "subAccount" },
  { title: "Member", key: "member" },

  { title: "Ref", key: "userRef" },
  { title: "Exchange Ref", key: "referenceCode" },
  { title: "Dealer", key: "dealer" },
  { title: "Buy/Sell", key: "buySell" },
  { title: "Order State", key: "orderState" },
  {
    title: "QTY",
    key: "quantity",
    order: 2,
  },

  { title: "O/QTY", key: "originalQuantity" },
  { title: "Principle Agency", key: "principleAgency" },
];
const getSortedHeaders = computed(
  () => state.selectedHeaders
  // .sort((a, b) => (a.order < b.order ? -1 : 1))
);

const groupingHeaders = ref([]);
function getGroupKey(item: MainModel): string {
  return groupingHeaders.value.map((header) => item[header]).join("|");
}
function groupData(data: MainModel[], headers: string[]): TableItem[] {
  if (!headers.length) {
    return data.map((item) => ({
      _open: true,
      _groupKey: "",
      items: [item],
    }));
  }

  const groupHeader = headers[0];
  const remainingHeaders = headers.slice(1);

  const groups: { [key: string]: MainModel[] } = {};
  for (const item of data) {
    const groupKey = String(item[groupHeader as keyof MainModel]);

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }

    groups[groupKey].push(item);
  }

  return Object.entries(groups).map(([groupKey, groupItems]) => ({
    _open: true,
    _groupKey: groupKey,
    items: groupData(groupItems, remainingHeaders),
  }));
}

const tableData = computed(() => ({
  _open: true,
  _groupKey: "root",
  items: groupData(filteredData.value, groupingHeaders.value),
}));
type GroupKey = string;
const openGroups = ref<Set<GroupKey>>(new Set());

const state = reactive<{
  openHeaderPicker: boolean;
  openInstruments: boolean;
  selectedHeaders: any[];
  selectedRows: MainModel[];
  currentSubscriptions: MainModel[];
}>({
  openHeaderPicker: false,
  selectedRows: [],
  openInstruments: false,
  selectedHeaders: headers.concat([]),
  currentSubscriptions: [],
});

function openEditOrder() {}
const dialogs = reactive({
  deleteOrder: false,
  deleteAll: false,
  suspendAll: false,
  resubmitSuspended: false,
  editOrder: false,
  editSuspended: false,
  suspendOrder: false,
});

const actionButtons = computed<ActionButton[]>(() => [
  {
    id: "1",
    tooltip: "Edit Order",
    color: "white",
    disabled: state.selectedRows.length != 1,
    variant: "tonal",
    density: "compact",
    icon: "mdi-text-box-edit",
    textField: null,
    action: () => {
      // edit order
      // Present modal first -> modal should submit

      dialogs.editOrder = true;
      // if (state.selectedRows.length == 1) {
      //   console.log("Suspend Order ", state.selectedRows);
      //   socket.value?.invoke(
      //     "EditActiveOrderBySeq",
      //     state.selectedRows[0].activeOrderSeq
      //   );
      // }
    },
  },
  {
    id: "2",
    tooltip: "Suspend Order",
    disabled: state.selectedRows.length != 1,
    color: "white",
    variant: "tonal",
    density: "compact",
    icon: "mdi-cancel",
    textField: null,
    action: () => {
      /* Suspend Order Action */
      if (state.selectedRows.length == 1) {
        console.log("Suspend Order ", state.selectedRows);
        dialogs.suspendOrder = true;
        // socket.value?.invoke(
        //   "SuspendTrade",
        //   state.selectedRows[0].activeOrderSeq
        // );
      }
    },
  },
  {
    id: "3",
    tooltip: "Delete Order",
    disabled: state.selectedRows.length != 1,
    color: "white",
    variant: "tonal",
    density: "compact",
    icon: "mdi-delete",
    textField: null,
    action: () => {
      /* Delete Order Action */
      if (state.selectedRows.length == 1) {
        console.log("Prompt Delete Order ", state.selectedRows);
        dialogs.deleteOrder = true;
        // socket.value?.invoke(
        //   "DeleteTrade",
        //   state.selectedRows[0].activeOrderSeq
        // );
      }
    },
  },
  // // Assuming menu items are also part of action buttons
  // {
  //   id: "4",
  //   tooltip: "Reduce Order",
  //   disabled: state.selectedRows.length != 1,
  //   color: "transparent",
  //   variant: "flat",
  //   density: "compact",
  //   icon: "mdi-cash",
  //   textField: {
  //     density: "compact",
  //     variant: "solo",
  //     singleLine: true,
  //     label: "QTY",
  //     hideDetails: "auto",
  //     placeholder: "2",
  //     type: "number",
  //   },
  //   action: () => {
  //     /* Reduce Order Action */
  //   },
  // },
  {
    id: "5",
    tooltip: "Delete All",
    color: "white",
    variant: "tonal",
    density: "compact",
    icon: "mdi-delete-sweep-outline",
    textField: null,
    action: () => {
      /* Delete Order Action */
      if (filteredData.value.length > 0) {
        console.log("Prompt Delete Order ", state.selectedRows);
        dialogs.deleteAll = true;
      }
    },
  },
  {
    id: "6",
    tooltip: "Suspend All",
    color: "white",
    variant: "tonal",
    density: "compact",
    icon: "mdi-folder-cancel",
    textField: null,
    action: () => {
      /* Suspend all orders Action */
      if (filteredData.value.length > 0) {
        console.log("Prompt Suspend all ", filteredData);
        dialogs.suspendAll = true;
      }
    },
  },
  {
    id: "7",
    tooltip: "Edit suspended order",
    disabled: state.selectedRows.length != 1,
    color: "white",
    variant: "tonal",
    density: "compact",
    icon: "mdi-pencil-circle-outline",
    textField: null,
    action: () => {
      /* Delete Order Action */
    },
  },
  {
    id: "8",
    tooltip: "Re-submit suspended order",
    color: "white",
    variant: "tonal",
    density: "compact",
    icon: "mdi-send-circle-outline",
    textField: null,
    action: () => {
      /* Delete Order Action */
    },
  },
  {
    id: "9",
    tooltip: "Table Headers",
    color: "white",
    variant: "tonal",
    density: "compact",
    icon: "mdi-table-headers-eye",
    textField: null,
    action: () => {
      state.openHeaderPicker = true;
    },
  },

  // Repeat similar structure for other items in v-menu...
]);

const emits = defineEmits(["newComp", "closeComp"]);
const { closeComponent } = useCommonComponentFunctions(emits);

const endpoint = "/market";
const filters: FilterCondition[] = [];
function onRowClicked(e: any, a: any) {
  console.log("Clicked on row - a - ", a);
  console.log("Clicked on row - e - ", e);
}

onMounted(() => {
  console.log(
    "Custom store customActions: ",
    useCustomActiveOrderStore,
    useActiveOrdersStore,
    mainStore
  );
});
const { socket, subscribe, filteredData, typedArray } = useWebSocket<
  MainModel,
  CustomActiveOrderActions
>(
  useCustomActiveOrderStore(),
  endpoint,
  filters,
  {
    name: "ActiveOrderUpdate",
    func: processUpdate,
  },
  async () => {
    console.log("Active Orders init function");
    if (socket.value) {
      console.log("Has socket");
      socket.value?.invoke("PublishAllData", PublishAll.ActiveOrders);
    }
  }
);
mainStore().customActions?.customActions?.customAction();
// const { socket, filteredData, subscribeToSelected, typedArray } =
//   useWebSocket<MainModel, CustomActiveOrderActions>(
//     useCustomActiveOrderStore(),
//     endpoint,
//     filters,
//     {
//       name: "ActiveOrderUpdate",
//       func: processUpdate,
//     },
//     async () => {
//       console.log("Active Order init function IE publish all active orders");
//       if (socket.value) {
//         console.log("Has socket");
//         socket.value?.invoke("PublishAllData", PublishAll.ActiveOrders);
//       }
//     }
//   );
function processUpdate(message: string) {
  try {
    const temp = typedArray<MainModel>(message);
    temp.forEach((e) => {
      // mainStore().getData.value.find(inner => e.activeOrderSeq == inner.activeOrderSeq);
      mainStore().updateItem(e);
    });
    console.log("Parsed update : ", temp);
    //
  } catch (err) {
    console.error("error parsing OPTION MARKET UPDATE for ", message, err);
  }
}
const props = defineProps({
  class: String,
  style: {
    type: Object,
    required: true,
  },
});
interface ItemState {
  isOpen: boolean;
  qty: number | undefined;
}
let itemStates = reactive<Record<number, ItemState>>({});
console.log("Items states ", itemStates);

watch(
  () => filteredData.value,
  (newItems) => {
    newItems.forEach((item) => {
      console.log("Test watch", filteredData.value);
      if (!(item.activeOrderSeq in itemStates)) {
        itemStates[item.activeOrderSeq] = { isOpen: false, qty: undefined };
      }
    });

    // If an item is removed, we should also remove its key from the itemStates
    for (let id in itemStates) {
      if (!newItems.some((item) => item.activeOrderSeq.toString() === id)) {
        delete itemStates[id];
      }
    }
  },
  { deep: true, immediate: true }
);
const closeMenu = (uniqueId: number) => {
  itemStates[uniqueId].isOpen = false;
};
</script>
