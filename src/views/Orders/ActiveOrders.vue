<template>
  <v-container
    fluid
    :style="props.style"
    key="ActiveOrders"
    class="bg-grey d-flex flex-column"
  >
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
          item-key="_groupKey"
          :headers="getSortedHeaders"
          :items="tableData.items"
          ><template
            v-slot:group-header="{
              item,
              columns,
              toggleGroup,
              isGroupOpen,
              isSelected,
              toggleSelect,
              depth = 0,
            }"
          >
            <tr :id="'group_' + item._groupKey">
              <td :colspan="columns.length" class="text-start">
                <div :style="{ marginLeft: `${depth * 20}px` }">
                  <v-btn
                    size="small"
                    variant="text"
                    :icon="isGroupOpen(item) ? '$expand' : '$next'"
                    @click="toggleGroup(item)"
                  ></v-btn>
                  {{ item._groupKey }}
                </div>
              </td>
            </tr>
            <template v-for="subItem in item.items">
              <tr
                v-if="subItem._isGroup && isGroupOpen(item)"
                :slot="'group-header'"
                :key="subItem._isGroup"
              >Main flow
                <!-- <template v-slot="subSlotData">
                  <template v-slot:group-header="groupHeaderData">
                    <group-header
                      v-bind="groupHeaderData"
                      :depth="depth + 1"
                    ></group-header>
                  </template>
                </template> -->
              </tr>
              <tr
                
              >else</tr>
            </template>
          </template>
          <template
            v-slot:item.data-table-select="{ item, toggleSelect, isSelected }"
          >
            <v-checkbox-btn
              color="primary"
              :disabled="
                state.selectedRows.length >= 2 &&
                !state.selectedRows.includes(item)
              "
              :model-value="isSelected(item)"
              @click.stop.prevent="() => toggleSelect(item)"
            ></v-checkbox-btn>
          </template>
          <template #bottom></template
        ></v-data-table>
        <!-- <v-data-table
          v-model="state.selectedRows"
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
          <template
            v-slot:group-header="{
              item,
              columns,
              toggleGroup,
              isGroupOpen,
              isSelected,
              toggleSelect,
            }"
          >
            <tr :id="'group_' + item.value">
              <td :colspan="columns.length" class="text-start">
                <v-btn
                  size="small"
                  variant="text"
                  :icon="isGroupOpen(item) ? '$expand' : '$next'"
                  @click="toggleGroup(item)"
                ></v-btn>
                {{ item.value }}
              </td>
            </tr>
          </template>
          <template
            v-slot:item.data-table-select="{ item, toggleSelect, isSelected }"
          >
            <v-checkbox-btn
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
        </v-data-table> -->
      </v-col>
    </v-row>
    <VDialog
      v-model="state.openHeaderPicker"
      scrollable
      width="auto"
      key="Futures_addInstruments"
    >
      <VCard height="80vh" min-width="300" color="white">
        <VCardTitle class="bg-primary"
          ><v-row justify="space-between" align="center">
            <v-col cols="10" sm="9">Instrument Headers</v-col>
            <v-col cols="2" sm="auto"
              ><v-btn
                @click="state.openHeaderPicker = false"
                size="small"
                icon
                color="transparent"
                flat
              >
                <v-icon icon="mdi-close"></v-icon> </v-btn
            ></v-col> </v-row
        ></VCardTitle>
        <VCardText>
          <VList>
            <VListItem
              lines="one"
              v-for="header in headers"
              :key="header.title"
              :title="header.title"
              :id="header.title"
            >
              <template v-slot:prepend>
                <VListItemAction start>
                  <VCheckboxBtn
                    @change="updateHeader($event, header)"
                    :model-value="state.selectedHeaders.find((e: any) => e.key == header.key) != null"
                  ></VCheckboxBtn>
                </VListItemAction>
              </template>
            </VListItem>
          </VList>
        </VCardText>
      </VCard>
    </VDialog>
  </v-container>
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  ref,
  Ref,
  reactive,
  onMounted,
  onBeforeUnmount,
} from "vue";
import { useLayoutStore } from "@/store/layout";
import { useAppStore } from "@/store/app";
import { useContractsStore } from "@/store/contracts";
import { useActiveOrdersStore } from "@/store/activeOrders";

import CommonToolbar from "@/components/CommonToolbar.vue";

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

interface TableItem {
  _open: boolean;
  _groupKey: string;
  items: TableItem[] | MainModel[];
}
const appStore = useAppStore();
const mainStore = useActiveOrdersStore();
const { calculateTableHeight, Reference } = useTableHeightCalculator();

const headers: any[] = [
  // { title: "Contract", key: "contract", align: "start" },
  { title: "Enter Time", key: "enterTime", order: 1 },
  {
    title: "Date",
    key: "contractDisplay.contractDate",
  },
  {
    title: "Instrument",
    key: "contractDisplay.instrument",
  },
  { title: "Principal", key: "userCode" },
  { title: "Sub Acc", key: "subAccount" },
  { title: "Member", key: "member" },
  { title: "Dealer", key: "dealer" },
  { title: "Buy/Sell", key: "buySell" },
  { title: "Order State", key: "orderState" },
  {
    title: "QTY",
    key: "quantity",
    order: 2,
  },

  { title: "Rate", key: "rate" },
  { title: "O/QTY", key: "originalQuantity" },
  { title: "Principle Agency", key: "principleAgency" },
];
const getSortedHeaders = computed(() =>
  state.selectedHeaders.sort((a, b) => (a.order < b.order ? -1 : 1))
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
  instrumentsToAdd: MainModel[];
}>({
  openHeaderPicker: false,
  selectedRows: [],
  openInstruments: false,
  selectedHeaders: headers.concat([]),
  currentSubscriptions: [],
  instrumentsToAdd: [],
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
      //
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
    },
  },
  // Assuming menu items are also part of action buttons
  {
    id: "4",
    tooltip: "Reduce Order",
    disabled: state.selectedRows.length != 1,
    color: "transparent",
    variant: "flat",
    density: "compact",
    icon: "mdi-cash",
    textField: {
      density: "compact",
      variant: "solo",
      singleLine: true,
      label: "QTY",
      hideDetails: "auto",
      placeholder: "2",
      type: "number",
    },
    action: () => {
      /* Reduce Order Action */
    },
  },
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
      /* Delete Order Action */
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
const { socket, filteredData, subscribeToSelected, typedArray } =
  useWebSocket<MainModel>(
    useActiveOrdersStore,
    endpoint,
    filters,
    {
      name: "ActiveOrderUpdate",
      func: processUpdate,
    },
    async () => {
      console.log("Active Order init function IE publish all active orders");
      if (socket.value) {
        console.log("Has socket");
        socket.value?.invoke("PublishAllData", PublishAll.ActiveOrders);
      }
    }
  );
function processUpdate(message: string) {
  try {
    const temp = typedArray<MainModel>(message);
    temp.forEach((e) => {
      mainStore.updateItem(e);
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
function updateHeader(e: Event, i: any) {
  console.log("Update header ", (e?.target as any).value, i);
  const foundSelected = state.selectedHeaders.findIndex(
    (item) => item.key == i.key
  );
  if (foundSelected != -1) {
    state.selectedHeaders.splice(foundSelected, 1);
  } else {
    state.selectedHeaders.push(i);
  }
}
</script>
