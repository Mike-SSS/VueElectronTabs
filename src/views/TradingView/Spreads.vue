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
      title="Spreads"
      tooltip="This is more information on spreads. Example description"
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
          <!-- <template
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
          </template> -->
          <template #bottom></template>
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
  </v-container>
</template>

<script lang="ts" setup>
import OpenInstruments from "@/components/ContractsModal/OpenInstruments.vue";
import HeaderPicker from "@/components/HeaderPicker.vue";
import { computed, ref, reactive, onMounted, onBeforeUnmount } from "vue";
import InsertOrder from "@/components/OrderModals/InsertOrderSpreads.vue";
import { useLayoutStore } from "@/store/layout";
import { useWebSocket } from "@/utils/useWebsocket";
import { useAppStore } from "@/store/app";
import {
  MarketDisplayStoreActions,
  useMarketDisplayStore,
} from "@/store/marketDisplay";
import {
  FilterCondition,
  MarketDisplayItemContract as MainModel,
  PublishAll,
} from "@/models/marketData";

import { useTableHeightCalculator } from "@/utils/useTableHeightCalculator";
import { noAuthInstance } from "@/plugins/axios";
import { useCommonComponentFunctions } from "@/utils/commonComponentFunctions";
import { ActionButton } from "@/models/UI";
import CommonToolbar from "@/components/CommonToolbar.vue";
import { BuySell } from "@/models/trading";

const emits = defineEmits(["newComp", "closeComp"]);
const { closeComponent } = useCommonComponentFunctions(emits);

const appStore = useAppStore();
const mainStore = useMarketDisplayStore();

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

const endpoint = "/market";
const filters: FilterCondition[] = [
  { field: "contractDisplay.contracT_TYPE", value: 3, operator: "==" },
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
    console.log("Spreads/Market init function");
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
  console.log("Mounted Spreads");
});
onBeforeUnmount(() => {});
// const instrumentsToAdd = ref(<MarketDisplayItem[]>[]);
// const currentSubscriptions = ref(<MarketDisplayItem[]>[]);
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
