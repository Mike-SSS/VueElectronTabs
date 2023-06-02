<template>
  <v-container
    fluid
    :style="props.style"
    id="Futures"
    class="bg-grey d-flex flex-column"
  >
    <CommonToolbar
      :socket-state="socket?.state"
      :class="props.class"
      :close-component="closeComponent"
      :data-length="filteredData.length"
      :action-buttons="actionButtons"
      title="Futures"
      tooltip="This is more information on futures. Example description"
    ></CommonToolbar>
    <v-row class="fill-height">
      <v-col cols="12" class="pa-0 fill-height" ref="Reference">
        <v-data-table
          density="compact"
          :group-by="[{ key: 'contractDisplay.instrument' }]"
          :items="state.currentSubscriptions"
          :headers="getSortedHeaders"
          :height="calculateTableHeight"
          fixed-header
          :items-per-page="-1"
        >
          <template v-slot:group-header="{ item, columns, toggleGroup }">
            <tr :id="'group_' + item.value" style="height: 20px">
              <td :colspan="columns.length" class="text-start">
                <v-btn
                  :size="25"
                  variant="plain"
                  :icon="'$expand'"
                  @click="toggleGroup(item)"
                ></v-btn>
                {{ item.value }}
              </td>
            </tr>
          </template>
          <template #bottom></template>
          <!-- <template v-slot:item="props">
            {{ Object.keys(props) }}
            <tr>
              <td class="v-data-table__td" v-for="i in props.item.columns">
                {{ i }}
              </td>
            </tr>
          </template> -->
          <template #item.bid="{ item }">
            <v-tooltip text="Insert Bid" content-class="bg-success">
              <template #activator="{ props }">
                <v-btn
                  @click.prevent.stop="openTradeModal(item.raw, BuySell.Buy)"
                  density="compact"
                  color="transparent"
                  variant="flat"
                  :height="20"
                  v-bind="props"
                  class="positive"
                  v-mutate="{
                    handler: onTextChange,
                    options: {
                      characterData: true,
                      childList: true,
                      subtree: true,
                    },
                  }"
                >
                  <span class="v-data-table__td"
                    >{{ item.columns.bid ? item.columns.bid.toString() : "0" }}
                  </span>
                  <!-- <span v-mutate="onMutate">
                    <span>{{
                      item.columns.bid ? item.columns.bid.toString() : "0"
                    }}</span>
                  </span> -->
                </v-btn>
              </template>
            </v-tooltip>
          </template>
          <template #item.offer="{ item }">
            <v-tooltip text="Insert Offer" content-class="bg-error">
              <template #activator="{ props }">
                <v-btn
                  @click.prevent.stop="openTradeModal(item.raw, BuySell.Sell)"
                  density="compact"
                  color="transparent"
                  :height="20"
                  variant="flat"
                  v-bind="props"
                  class="negative"
                  v-mutate="{
                    handler: onTextChange,
                    options: {
                      characterData: true,
                      childList: true,
                      subtree: true,
                    },
                  }"
                >
                  <span class="v-data-table__td">{{
                    item.columns.offer ? item.columns.offer.toString() : "0"
                  }}</span>
                </v-btn>
              </template>
            </v-tooltip>
          </template>
          <template #item.change="{ item }">
            <span
              :class="
                item.columns.change < 0
                  ? 'text-red'
                  : item.columns.change == 0
                  ? ''
                  : 'text-blue'
              "
              >{{ item.columns.change }}</span
            ></template
          >
          <template #item.last="{ item }">
            <span
              :class="
                item.columns.last < item.columns.offer
                  ? 'text-red'
                  : 'text-blue'
              "
              >{{ item.columns.last }}</span
            ></template
          >
        </v-data-table>
      </v-col>
    </v-row>
    <HeaderPicker
      v-model="state.openHeaderPicker"
      v-model:tableHeaders.sync="headers"
      v-model:selectedHeaders.sync="state.selectedHeaders"
    ></HeaderPicker>
    <!-- <v-dialog
      v-model="state.openHeaderPicker"
      scrollable
      width="auto"
      key="Futures_addInstruments"
    >
      <v-card height="80vh" min-width="300" color="white">
        <v-card-title class="bg-primary"
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
        ></v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item
              lines="one"
              v-for="header in headers"
              :key="header.title"
              :title="header.title"
              :id="header.title"
            >
              <template v-slot:prepend>
                <v-list-item-action>
                  <v-checkbox-btn
                    @change="updateHeader($event, header)"
                    :model-value="state.selectedHeaders.find((e: any) => e.key == header.key) != null"
                  ></v-checkbox-btn>
                </v-list-item-action>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog> -->
    <InsertOrder
      v-model="tradeModal.open"
      :type="tradeModal.type"
      :item="tradeModal.item ? tradeModal.item : undefined"
      :socket="socket ? socket : undefined"
    ></InsertOrder>

    <v-dialog
      v-model="state.openInstruments"
      scrollable
      width="auto"
      key="Futures_addInstruments"
    >
      <v-card height="80vh" width="80vw">
        <v-card-title class="bg-primary"
          ><v-row justify="space-between">
            <v-col cols="10"
              >Instrument List ({{
                filteredData ? filteredData.length : -2
              }})</v-col
            >
            <v-col cols="2" sm="auto"
              ><v-btn icon size="20" color="error" flat></v-btn
              ><v-btn
                @click="state.openInstruments = false"
                size="small"
                icon
                color="transparent"
                flat
              >
                <v-icon icon="mdi-close"></v-icon> </v-btn
            ></v-col> </v-row
        ></v-card-title>
        <v-card-subtitle>
          <v-container fluid
            ><v-row align="center">
              <v-col cols="4"
                ><v-text-field
                  hide-details
                  label="Search"
                  append-inner-icon="mdi-magnify"
                  variant="outlined"
                ></v-text-field
              ></v-col>
              <v-spacer></v-spacer>
              <v-col cols="auto"
                ><v-btn
                  @click="subscribeToSelected"
                  :disabled="state.instrumentsToAdd.length == 0"
                  color="primary"
                >
                  Add ({{ state.instrumentsToAdd.length }})</v-btn
                ></v-col
              >
              <v-col cols="auto"
                ><v-btn @click="state.openInstruments = false" color="primary">
                  Done</v-btn
                ></v-col
              >
            </v-row></v-container
          >
        </v-card-subtitle>
        <v-card-text>
          <v-data-table
            density="compact"
            :items="notSelectedData"
            v-model="state.instrumentsToAdd"
            :headers="state.selectedHeaders"
            multi-sort
            :group-by="[{ key: 'contractDisplay.instrument' }]"
            height="60vh"
            show-select
            return-object
            fixed-header
            item-value="contract"
            :items-per-page="-1"
          >
            <!-- :group-by="[{ key: 'contractDisplay.instrument' }]" -->
            <!-- { item, columns, toggleGroup, isGroupOpen } -->
            <!-- "index", "item", "columns", "isExpanded", "toggleExpand", "isSelected", "toggleSelect", "toggleGroup", "isGroupOpen" -->
            <template v-slot:group-header="{ item, columns, toggleGroup }">
              <tr :id="'group_' + item.value">
                <td :colspan="columns.length">
                  <v-btn
                    :size="25"
                    variant="text"
                    icon="$expand"
                    @click="toggleGroup(item)"
                  ></v-btn>
                  {{ item.value }} ({{ item.items.length }})
                </td>
              </tr>
            </template>
            <template
              v-slot:item.data-table-select="{ item, toggleSelect, isSelected }"
            >
              <v-checkbox-btn
                style="font-size: 0.7rem"
                color="primary"
                :model-value="isSelected([item])"
                @click.stop.prevent="() => toggleSelect(item)"
              ></v-checkbox-btn>
            </template>
            <template #bottom></template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="state.openInstruments = false"
            >Close Instruments</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, nextTick } from "vue";
import InsertOrder from "@/components/OrderModals/InsertOrderFutures.vue";
import HeaderPicker from "@/components/HeaderPicker.vue";

import { useAppStore } from "@/store/app";
import {
  useMarketDisplayStore,
  MarketDisplayStoreActions,
} from "@/store/marketDisplay";
import { useWebSocket } from "@/utils/useWebsocket";
import { useTableHeightCalculator } from "@/utils/useTableHeightCalculator";
import {
  MarketDisplayItemContract as MainModel,
  FilterCondition,
  PublishAll,
} from "@/models/marketData";
import { useCommonComponentFunctions } from "@/utils/commonComponentFunctions";
import { ActionButton } from "@/models/UI";
import CommonToolbar from "@/components/CommonToolbar.vue";
import { onMounted } from "vue";
import { BuySell } from "@/models/trading";

export type DataTableHeaderCustom = {
  key: string;
  title: string;
  colspan?: number;
  rowspan?: number;
  fixed?: boolean;
  align?: "start" | "end" | "center";
  width?: number | string;
  minWidth?: string;
  maxWidth?: string;
  sortable?: boolean;
};
const mainStore = useMarketDisplayStore();

const emits = defineEmits(["newComp", "closeComp"]);
const { closeComponent } = useCommonComponentFunctions(emits);

const notSelectedData = computed(() =>
  filteredData.value.filter(
    (x) =>
      state.currentSubscriptions.findIndex((e) => e.contract == x.contract) ==
      -1
  )
);

const endpoint = "/market";
const { calculateTableHeight, Reference } = useTableHeightCalculator();
function getOppositeDirection(
  dir: "positive" | "negative" | "none"
): "positive" | "negative" | "none" {
  switch (dir) {
    case "positive":
      return "negative";
    case "negative":
      return "positive";
    default:
      return "none";
  }
}
function onTextChange(
  mutationList: MutationRecord[],
  observer: MutationObserver
) {
  // console.log("On text change ", mutationList, observer);
  mutationList.forEach((mutation: MutationRecord) => {
    if (
      mutation.type === "childList" &&
      mutation.addedNodes.length &&
      mutation.removedNodes.length
    ) {
      const addedNode = mutation.addedNodes[0] as Text;
      const removedNode = mutation.removedNodes[0] as Text;

      if (addedNode.data !== removedNode.data) {
        const oldValue = removedNode.data;
        const newValue = addedNode.data;

        const temp = (mutation.target as any).offsetParent as Element;
        let dir: "positive" | "negative" | "none" = "none";
        if (temp && temp.classList) {
          if (temp.classList.contains("positive")) {
            console.log("Positive");
            dir = "positive";
          } else if (temp.classList.contains("negative")) {
            console.log("Negative");
            dir = "negative";
          }
        }

        // console.log(
        //   `Old value: ${oldValue}, New value: ${newValue}, Dir: ${dir} vs ${getOppositeDirection(
        //     dir
        //   )}`
        // );
        if (dir == "none") return;
        // Perform additional actions here, such as adding a class for a color change
        if (newValue < oldValue) {
          // Added value is larger, indicating an upward movement
          (mutation.target as Element).classList.remove(`text-${dir}`);
          (mutation.target as Element).classList.add(
            `text-${getOppositeDirection(dir)}`
          );
          setTimeout(() => {
            (mutation.target as Element).classList.remove(
              `text-${getOppositeDirection(dir)}`
            );
          }, 2000); // remove after 2 seconds
        } else if (newValue > oldValue) {
          // Added value is smaller, indicating a downward movement
          (mutation.target as Element).classList.remove(
            `text-${getOppositeDirection(dir)}`
          );
          (mutation.target as Element).classList.add(`text-${dir}`);
          setTimeout(() => {
            (mutation.target as Element).classList.remove(`text-${dir}`);
          }, 2000); // remove after 2 seconds
        }
      }
    }
  });
}

const actionButtons = ref<ActionButton[]>([
  {
    id: "1",
    tooltip: "Sync",
    color: "white",
    variant: "tonal",
    density: "compact",
    icon: "mdi-sync",
    textField: null,
    action: async () => {
      const store = useMarketDisplayStore();
      await store().customActions.customActions?.loadMarketDisplay();
    },
  },
  {
    id: "2",
    tooltip: "Instruments",
    color: "white",
    variant: "tonal",
    density: "compact",
    icon: "mdi-plus",
    textField: null,
    action: () => {
      state.openInstruments = true;
    },
  },
  {
    id: "3",
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
]);

const filters: FilterCondition[] = [
  { field: "contractDisplay.flag", value: "F", operator: "==" },
  { field: "contractDisplay.strike", value: 0, operator: "==" },
  { field: "contractDisplay.contracT_TYPE", value: 1, operator: "==" },
];

const { socket, subscribe, filteredData, typedArray } = useWebSocket<
  MainModel,
  MarketDisplayStoreActions
>(
  useMarketDisplayStore(),
  endpoint,
  filters,
  {
    name: "marketUpdate",
    func: processUpdate,
  },
  async () => {
    console.log("Futures/Market init function");
    if (socket.value) {
      console.log("Has socket");
      // socket.value?.invoke("PublishAllData", PublishAll.ContractDate);
    }
  }
);
function processUpdate(message: string) {
  try {
    const temp = typedArray<MainModel>(message);
    temp.forEach((e) => {
      console.log("Process update - Update item in store");
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
const headers: DataTableHeaderCustom[] = [
  // { title: "Contract", key: "contract", align: "start" },
  { title: "Expiry", key: "contractDisplay.contractDate" },
  // { title: "Instrument", key: "contractDisplay.instrument" },
  {
    title: "B/QTY",
    key: "qtyBid",
  },
  {
    title: "Bid",
    key: "bid",
  },
  { title: "Offer", key: "offer" },
  { title: "O/QTY", key: "qtyOffer" },
  { title: "Change", key: "change" },
  { title: "Last", key: "last" },
  { title: "Time", key: "time" },
  { title: "High", key: "hi" },
  { title: "Low", key: "lo" },
  { title: "Open", key: "openPrice" },
  { title: "Volume", key: "volume" },
];
const getSortedHeaders = computed(
  () =>
    // state.selectedHeaders.sort((a, b) => (a.order < b.order ? -1 : 1))
    state.selectedHeaders
);
const state = reactive<{
  openHeaderPicker: boolean;
  openInstruments: boolean;
  selectedHeaders: any[];
  currentSubscriptions: MainModel[];
  instrumentsToAdd: MainModel[];
}>({
  openHeaderPicker: false,
  openInstruments: false,
  selectedHeaders: headers.concat([]),
  currentSubscriptions: [],
  instrumentsToAdd: [],
});

const tradeModal = reactive<{
  open: boolean;
  type: BuySell | "None";
  item: null | MainModel;
}>({
  type: BuySell.Buy,
  open: false,
  item: null,
});

function openTradeModal(item: MainModel, type: "None" | BuySell) {
  tradeModal.item = item;
  tradeModal.type = type;
  tradeModal.open = true;
}
function closetradeModal() {
  tradeModal.open = false;
  tradeModal.item = null;
}
const subscribeToSelected = () => {
  console.log("Subscribing to : ", state.instrumentsToAdd);
  subscribe(state.instrumentsToAdd.map((e) => e.contract));
  state.instrumentsToAdd.forEach((e) => {
    const found = filteredData.value.findIndex(
      (match) => e.contract == match.contract
    );
    if (found == -1) return;
    console.log("Subscribe to index: ", found);
    state.currentSubscriptions.push(filteredData.value[found]);
  });
  state.instrumentsToAdd.splice(0);
};
</script>
<style lang="scss">
// .text-up {
//   animation: fadePositiveTextToBlack 2s ease-out forwards,
//     fadePositiveBackgroundToTransparent 2s ease-out forwards;
// }

// .text-down {
//   animation: fadeNegativeTextToBlack 2s ease-out forwards,
//   fadeNegativeBackgroundToTransparent 2s ease-out forwards;
// }
</style>
