<template>
  <v-container
    fluid
    :style="props.style"
    id="Splits"
    class="bg-grey d-flex flex-column"
  >
    <CommonToolbar
      :socket-state="socket?.state"
      :class="props.class"
      :close-component="closeComponent"
      :data-length="filteredData.length"
      :action-buttons="actionButtons"
      title="Splits"
      tooltip="This is more information on splits. Example description"
    ></CommonToolbar>
    <v-row class="fill-height">
      <v-col cols="12" class="pa-0 fill-height" ref="Reference">
        <v-data-table
          density="compact"
          :group-by="[{ key: 'contractDisplay.instrument' }]"
          :items="state.currentSubscriptions"
          :headers="getSortedHeaders"
          height="100%"
          fixed-header
        >
          <template v-slot:group-header="{ item, columns, toggleGroup }">
            <tr :id="'group_' + item.value">
              <td :colspan="columns.length" class="text-start">
                <v-btn
                  :size="25"
                  variant="text"
                  :icon="'$expand'"
                  @click="toggleGroup(item)"
                ></v-btn>
                {{ item.value }}
              </td>
            </tr>
          </template>
          <template #bottom></template>

          <template #item.bid="{ item }">
            <v-tooltip text="Insert Bid" content-class="bg-success">
              <template #activator="{ props }">
                <v-btn
                  @click.prevent.stop="openTradeModal(item.raw, BuySell.Buy)"
                  density="compact"
                  color="transparent"
                  variant="flat"
                  v-bind="props"
                  :text="item.columns.bid ? item.columns.bid.toString() : '0'"
                ></v-btn>
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
                  variant="flat"
                  v-bind="props"
                  :text="
                    item.columns.offer ? item.columns.offer.toString() : '0'
                  "
                ></v-btn>
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
    <OpenInstruments
      v-model="state.openInstruments"
      :headers="state.selectedHeaders"
      :items="filteredData"
      :subscribe-to-selected="subscribeToSelected"
      :current-subscriptions="state.currentSubscriptions"
    ></OpenInstruments>
    <!-- <v-dialog
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
            class="tableData"
            :items="filteredData"
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
          > <template v-slot:group-header="{ item, columns, toggleGroup }">
              <tr :id="'group_' + item.value">
                <td :colspan="columns.length">
                  <v-btn
                    :size="25"
                    variant="text"
                    :icon="'$expand'"
                    @click="toggleGroup(item)"
                  ></v-btn>
                  {{ item.value }}
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="state.openInstruments = false"
            >Close Instruments</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog> -->
    <InsertOrder
      v-model="tradeModal.open"
      :type="tradeModal.type"
      :item="tradeModal.item ? tradeModal.item : undefined"
      :socket="socket ? socket : undefined"
    ></InsertOrder>
  </v-container>
</template>

<script lang="ts" setup>
import OpenInstruments from "@/components/ContractsModal/OpenInstruments.vue";
import HeaderPicker from "@/components/HeaderPicker.vue";
import { computed, ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useLayoutStore } from "@/store/layout";
import InsertOrder from "@/components/OrderModals/InsertOrderSplits.vue";

import { useAppStore } from "@/store/app";
import {
  MarketDisplayStoreActions,
  useMarketDisplayStore,
} from "@/store/marketDisplay";

import { useTableHeightCalculator } from "@/utils/useTableHeightCalculator";

import { useWebSocket } from "@/utils/useWebsocket";
import {
  FilterCondition,
  MarketDisplayItemContract as MainModel,
  PublishAll,
} from "@/models/marketData";
import { noAuthInstance } from "@/plugins/axios";
import { useCommonComponentFunctions } from "@/utils/commonComponentFunctions";

import CommonToolbar from "@/components/CommonToolbar.vue";
import { ActionButton } from "@/models/UI";
import { BuySell } from "@/models/trading";

const appStore = useAppStore();
const mainStore = useMarketDisplayStore();
const emits = defineEmits(["newComp", "closeComp"]);
const { closeComponent } = useCommonComponentFunctions(emits);

const endpoint = "/market";

function openTradeModal(item: MainModel, type: "None" | BuySell) {
  tradeModal.item = item;
  tradeModal.type = type;
  tradeModal.open = true;
}

const tradeModal = reactive<{
  open: boolean;
  type: BuySell | "None";
  item: null | MainModel;
}>({
  type: BuySell.Buy,
  open: false,
  item: null,
});

const actionButtons = ref<ActionButton[]>([
  {
    id: "1",
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
    id: "2",
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
  { field: "contractDisplay.contracT_TYPE", value: 4, operator: "==" },
];
const { socket, filteredData, subscribe, typedArray } = useWebSocket<
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
    console.log("Splits/Market init function");
    if (socket.value) {
      console.log("Has socket");
      // socket.value?.invoke("PublishAllData", PublishAll.ContractDate);
      // const res = await noAuthInstance.get("/api/download/publishall", {
      //   params: {
      //     publish: true,
      //     enumVal: PublishAll.ContractDate,
      //   },
      // });
      // if (res) {
      //   console.log("Publish all Result ", res.data);
      // }
    }
  }
);
function processUpdate(message: string) {
  try {
    const temp = typedArray<MainModel>(message);
    temp.forEach((e) => {
      mainStore().updateItem(e);
    });
    console.log("Parsed update : ", temp);
    //
  } catch (err) {
    console.error("error parsing OPTION MARKET UPDATE for ", message, err);
  }
}
const { calculateTableHeight, Reference } = useTableHeightCalculator();
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
onMounted(() => {
  console.log("Mounted Splits");
});
onBeforeUnmount(() => {});

const headers: any[] = [
  // { title: "Contract", key: "contract", align: "start" },
  { title: "Expiry", key: "contractDisplay.contractDate", order: 1 },
  // { title: "Instrument", key: "contractDisplay.instrument" },
  {
    title: "B/QTY",
    key: "qtyBid",
    order: 2,
  },
  {
    title: "Bid",
    key: "bid",
    order: 3,
  },
  { title: "Offer", key: "offer", order: 4 },
  { title: "O/QTY", key: "qtyOffer", order: 5 },
  { title: "Change", key: "change", order: 6 },
  { title: "Last", key: "last" },
  { title: "Time", key: "time" },
  { title: "High", key: "hi" },
  { title: "Low", key: "lo" },

  // { title: "Last", key: "last" },
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
}>({
  openHeaderPicker: false,
  openInstruments: false,
  selectedHeaders: headers.concat([]),
  currentSubscriptions: [],
});
async function subscribeToSelected(items: MainModel[]) {
  console.log("Subscribing to : ", items);
  subscribe(items.map((e) => e.contract));
  items.forEach((e) => {
    const found = filteredData.value.findIndex(
      (match) => e.contract == match.contract
    );
    if (found == -1) return;
    console.log("Subscribe to index: ", found);
    state.currentSubscriptions.push(filteredData.value[found]);
  });
  items.splice(0);
}
</script>
<style lang="scss" scoped>
.v-data-table {
  max-height: 100%;
  height: 100%;
}
// .v-table > .v-table__wrapper > table > thead > tr > th {
//   padding-left: 5px;
//   padding-right: 5px;
// }
</style>
