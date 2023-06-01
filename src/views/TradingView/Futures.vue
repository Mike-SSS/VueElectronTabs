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
            <tr :id="'group_' + item.value">
              <td :colspan="columns.length" class="text-start">
                <v-btn
                  size="small"
                  variant="text"
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
    <v-dialog
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
                <v-list-item-action start>
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
    </v-dialog>
    <InsertOrder
      v-model="tradeModal.open"
      :type="tradeModal.type"
      :item="tradeModal.item ? tradeModal.item : undefined"
      :socket="socket ? socket : undefined"
    ></InsertOrder>
    <!-- <v-dialog max-width="500">
      <v-card>
        <v-form
          validate-on="input"
          v-model="tradeModal.valid"
          @submit.prevent="enterTrade"
          ref="tradeForm"
        >
          <v-card-title
            :class="{
              'bg-primary': tradeModal.type == 'Bid',
              'bg-error': tradeModal.type == 'Offer',
              'bg-warning': tradeModal.type == 'None',
            }"
          >
            <template v-if="tradeModal.type == 'None'"
              >Something went wrong with loading
              {{ tradeModal.item?.contractDisplay.contractDisplay }}</template
            >
            <template v-else>
              {{ tradeModal.type }} for
              {{
                tradeModal.item
                  ? tradeModal.item.contractDisplay.contractDisplay
                  : "Empty"
              }}
            </template>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row v-if="tradeModal.form">
                <v-col cols="6"
                  ><v-text-field
                    type="number"
                    class="my-2"
                    label="QTY"
                    :rules="[
                      (msg: number) => !!msg || 'Qty Required',
                      (msg: number) => msg >= 0 || 'Qty cannot be less or equal to 0',
                    ]"
                    v-model="tradeModal.form.qty"
                  ></v-text-field>
                  <v-text-field
                    type="number"
                    class="my-2"
                    label="Price"
                    v-model="tradeModal.form.price"
                  ></v-text-field
                  ><v-radio-group v-model="tradeModal.form.capacity">
                    <v-radio
                      label="Principal"
                      :value="Capacity.PrincipalCapacity"
                    ></v-radio>
                    <v-radio
                      label="Agency"
                      :value="Capacity.AgencyCapacity"
                    ></v-radio> </v-radio-group
                ></v-col>
                <v-col cols="6"
                  ><v-select
                    v-model="tradeModal.form.dealer"
                    label="Dealer"
                  ></v-select
                  ><v-select
                    v-model="tradeModal.form.principal"
                    label="Principal"
                  ></v-select>
                  <v-text-field
                    v-model="tradeModal.form.ref"
                    label="Ref"
                  ></v-text-field
                  ><v-select
                    :items="
                      Object.entries(MitsOrderType)
                        .filter(([key]) => isNaN(Number(key)))
                        .map(([text, value]) => ({ text, value }))
                    "
                    :return-object="false"
                    item-title="text"
                    item-value="value"
                    v-model="tradeModal.form.type"
                    label="Type"
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn @click="closetradeModal" color="primary" variant="outlined"
              >Cancel</v-btn
            >
            <v-btn
              type="submit"
              :disabled="tradeModal.type == 'None' || tradeModal.valid == false"
              color="primary"
              variant="elevated"
              >Submit</v-btn
            >
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog> -->

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
          >
            <!-- :group-by="[{ key: 'contractDisplay.instrument' }]" -->
            <!-- { item, columns, toggleGroup, isGroupOpen } -->
            <!-- "index", "item", "columns", "isExpanded", "toggleExpand", "isSelected", "toggleSelect", "toggleGroup", "isGroupOpen" -->
            <template v-slot:group-header="{ item, columns, toggleGroup }">
              <tr :id="'group_' + item.value">
                <td :colspan="columns.length">
                  <v-btn
                    size="small"
                    variant="text"
                    icon="$expand"
                    @click="toggleGroup(item)"
                  ></v-btn>
                  {{ item.value }} ({{ columns.length }})
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
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, nextTick } from "vue";
import InsertOrder from "@/components/OrderModals/InsertOrderFutures.vue";

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

const endpoint = "/market";
const { calculateTableHeight, Reference } = useTableHeightCalculator();

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
      console.log("Process update - Update item in store")
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
    state.currentSubscriptions.push(e);
  });
  state.instrumentsToAdd.splice(0);
};
</script>
<style lang="scss">
// .v-table > .v-table__wrapper > table > thead > tr > th {
//   padding-left: 5px;
//   padding-right: 5px;
// }
</style>
