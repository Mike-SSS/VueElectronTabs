<template>
  <v-container
    fluid
    :style="props.style"
    id="Futures"
    class="bg-grey overflow-y-auto d-flex flex-column"
  >
    <CommonToolbar
      :socket-state="socket?.state"
      :class="props.class"
      :close-component="closeComponent"
      :data-length="filteredData.length"
      :action-buttons="actionButtons"
      title="Positions"
      tooltip="This is more information on positions. Example description"
    ></CommonToolbar>
    <v-row class="fill-height">
      <v-col cols="12" class="pa-0 fill-height" ref="Reference">
        <v-data-table
          density="compact"
          :items="filteredData"
          :group-by="[{ key: 'contractDisplay.instrument' }]"
          :headers="getSortedHeaders"
          :height="calculateTableHeight"
          fixed-header
          :items-per-page="-1"
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
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useLayoutStore } from "@/store/layout";

import { useAppStore } from "@/store/app";
import { usePositionsStore } from "@/store/positions";
import { useWebSocket } from "@/utils/useWebsocket";
import { useTableHeightCalculator } from "@/utils/useTableHeightCalculator";
import {
  MarketDisplayItemPosition as MainModel,
  FilterCondition,
  PublishAll,
} from "@/models/marketData";

import { noAuthInstance } from "@/plugins/axios";

import { useCommonComponentFunctions } from "@/utils/commonComponentFunctions";

import CommonToolbar from "@/components/CommonToolbar.vue";
import { ActionButton } from "@/models/UI";
// import { MarketDisplayStoreActions } from "@/store/marketDisplay";

const appStore = useAppStore();
const mainStore = usePositionsStore();

const emits = defineEmits(["newComp", "closeComp"]);
const { closeComponent } = useCommonComponentFunctions(emits);

const actionButtons = computed<ActionButton[]>(() => [
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
const { calculateTableHeight, Reference } = useTableHeightCalculator();

const filters: FilterCondition[] = [];

const { socket, subscribe, filteredData, typedArray } = useWebSocket<
  MainModel,
  {}
>(
  usePositionsStore,
  endpoint,
  filters,
  {
    name: "PositionUpdate",
    func: processUpdate,
  },
  async () => {
    console.log("Positions init function");
    if (socket.value) {
      console.log("Has socket");
      socket.value?.invoke("PublishAllData", PublishAll.Positions);
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
const headers: any[] = [
  { title: "Member", key: "member" },
  { title: "Principal", key: "principal" },
  // { title: "Instrument", key: "contractDisplay.instrument", align: "start" },
  { title: "Expiry", key: "contractDisplay.contractDate", align: "start" },
  {
    title: "Open",
    key: "open",
  },

  { title: "Bought", key: "bought" },
  { title: "Sold", key: "sold" },

  {
    title: "Close",
    key: "close",
    order: 5,
  },
  // { title: "Offer", key: "offer", order: 4 },
  // { title: "O/QTY", key: "qtyOffer", order: 5 },
  // { title: "Change", key: "change", order: 6 },
  // { title: "Time", key: "time", order: 7 },

  // // { title: "Last", key: "last" },
  // { title: "Volume", key: "volume", order: 8 },
];
const getSortedHeaders = computed(
  () => state.selectedHeaders
  // .sort((a, b) => (a.order < b.order ? -1 : 1))
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

const subscribeToSelected = () => {
  console.log("Subscribing to : ", state.instrumentsToAdd);
  subscribe(state.instrumentsToAdd.map((e) => e.contract));
  state.instrumentsToAdd.forEach((e) => {
    state.currentSubscriptions.push(e);
  });
  state.instrumentsToAdd.splice(0);
};
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
