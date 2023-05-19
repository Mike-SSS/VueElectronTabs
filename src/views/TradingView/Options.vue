<template>
  <v-container fluid :style="props.style" key="Options" class="bg-grey d-flex flex-column">
    <CommonToolbar
      :socket-state="socket?.state"
      :class="props.class"
      :close-component="closeComponent"
      :data-length="filteredData.length"
      :action-buttons="actionButtons"
      title="Options"
      tooltip="This is more information on options. Example description"
    ></CommonToolbar>
   <v-row class="fill-height">
      <v-col cols="12" class="pa-0" ref="Reference">
        <v-data-table
          density="compact"
          :group-by="[{ key: 'contractDisplay.instrument' }]"
          :items="state.currentSubscriptions"
          :headers="getSortedHeaders"
          :height="calculateTableHeight"
          fixed-header
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
            :group-by="[{ key: 'contractDisplay.instrument' }]"
            height="60vh"
            show-select
            return-object
            fixed-header
            item-value="contract"
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
                <td :colspan="columns.length">
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
import {
  computed,
  defineProps,
  ref,
  reactive,
  onMounted,
  onBeforeUnmount,
} from "vue";
import { useAppStore } from "@/store/app";
import { useMarketDisplayStore } from "@/store/marketDisplay";

import { useWebSocket } from "@/utils/useWebsocket";
import { useTableHeightCalculator } from "@/utils/useTableHeightCalculator";
import {
  FilterCondition,
  MarketDisplayItemContract as MainModel,
  PublishAll,
} from "@/models/marketData";
import { noAuthInstance } from "@/plugins/axios";
import { useContractsStore } from "@/store/contracts";
import { useCommonComponentFunctions } from "@/utils/commonComponentFunctions";
import CommonToolbar from "@/components/CommonToolbar.vue";
import { ActionButton } from "@/models/UI";
const appStore = useAppStore();
const mainStore = useMarketDisplayStore();

const emits = defineEmits(['newComp', 'closeComp']);;
const { closeComponent } = useCommonComponentFunctions(emits);

const endpoint = "/market";
const { calculateTableHeight, Reference } = useTableHeightCalculator();

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
      state.openInstruments = true
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
  { field: "contractDisplay.flag", value: "F", operator: "!==" },
  { field: "contractDisplay.contracT_TYPE", value: 2, operator: "==" },
  // { field: "contractDisplay.strike", value: 0, operator: "!==" },
];
const { socket, filteredData, subscribe, typedArray } = useWebSocket<MainModel>(
  useMarketDisplayStore,
  endpoint,
  filters,
  {
    name: "marketUpdate",
    func: processUpdate,
  },
  async () => {
    console.log("Options/Market init function");
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

onMounted(() => {
  console.log("Mounted Options ");
});
onBeforeUnmount(() => {});

function getUniqueValues() {
  const field = "contractDisplay";
  const child = "flag";
  return filteredData.value.reduce((unique: string[], item: MainModel) => {
    item;
    if (!unique.includes(<string>item[field][child])) {
      unique.push(<string>item[field][child]);
    }
    return unique;
  }, []);
}

const headers: any[] = [
  // { title: "Contract", key: "contract", align: "start" },
  { title: "Expiry", key: "contractDisplay.contractDate", order: 1 },
  { title: "Strike", key: "contractDisplay.strike", order: 6 },
  { title: "Flag", key: "contractDisplay.flag" },

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

  { title: "Time", key: "time", order: 7 },

  // { title: "Last", key: "last" },
  { title: "Volume", key: "volume", order: 8 },
];
const getSortedHeaders = computed(() =>
  state.selectedHeaders.sort((a, b) => (a.order < b.order ? -1 : 1))
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
<style lang="scss">
// .v-table > .v-table__wrapper > table > thead > tr > th {
//   padding-left: 5px;
//   padding-right: 5px;
// }
</style>
