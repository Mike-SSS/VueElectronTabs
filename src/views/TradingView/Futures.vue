<template>
  <v-container
    fluid
    :class="props.class"
    :style="props.style"
    key="Futures"
  >
    <v-row justify="space-between" align="center">
      <v-col cols="auto">
        <div class="text-h5">Futures</div>
      </v-col>
      <v-col cols="auto">
        <v-tooltip>
          <template v-slot:activator="{ props }">
            <v-btn
              density="compact"
              color="transparent"
              variant="flat"
              v-bind="props"
              icon
              ><v-icon>mdi-information</v-icon></v-btn
            >
          </template>
          <div>Current status</div>
          <div>
            <v-icon
              size="25"
              :color="
                connectionState.connection?.state == 'Connected'
                  ? 'success'
                  : 'error'
              "
              >mdi-circle</v-icon
            >
          </div>
          <div>Current status</div>
        </v-tooltip>
        <!-- lable and Add Instrument button here  -->
        <v-btn
          density="compact"
          color="transparent"
          variant="flat"
          icon
          @click="openInstruments = true"
          ><v-icon>mdi-plus</v-icon></v-btn
        >
      </v-col>
    </v-row>
    <v-row class="fill-height">
      <v-col cols="12" class="pa-0">
        <v-data-table
          density="compact"
          :items="currentSubscriptions"
          :headers="headers"
          height="200"
          fixed-header
        >
          <!-- <template #default="props">
              <tr>
                <th v-for="head in props" :key="head.key">{{ head }}</th>
              </tr>
            </template> -->
          <template v-slot:column.Column="{ column }">
            {{ column.title.toUpperCase() }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-dialog
      v-model="openInstruments"
      scrollable
      width="auto"
      key="Futures_addInstruments"
    >
      <v-card height="80vh" width="80vw">
        <v-card-title class="bg-primary"
          ><v-row justify="space-between">
            <v-col cols="10"
              >Instrument List ({{
                marketMessages ? marketMessages.length : -2
              }})</v-col
            >
            <v-col cols="2" sm="auto"
              ><v-btn icon size="20" color="error" flat></v-btn
              ><v-btn
                @click="openInstruments = false"
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
                  :disabled="instrumentsToAdd.length == 0"
                  color="purple"
                >
                  Add ({{ instrumentsToAdd.length }})</v-btn
                ></v-col
              >
              <v-col cols="auto"
                ><v-btn @click="openInstruments = false" color="blue">
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
            :items="marketMessages"
            v-model="instrumentsToAdd"
            :headers="headers"
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
                <!-- <td colspan="1">
                  <v-checkbox
                    :value="isSelected"
                    @click:append="toggleSelect"
                    hide-details
                  ></v-checkbox>
                </td> -->
                <td :colspan="columns.length">
                  <VBtn
                    size="small"
                    variant="text"
                    :icon="isGroupOpen(item) ? '$expand' : '$next'"
                    @click="toggleGroup(item)"
                  ></VBtn>
                  {{ item.value }}
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="openInstruments = false"
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
import { useLayoutStore } from "@/store/layout";
import { useAppStore } from "@/store/app";
import { useMarketDisplayStore } from "@/store/marketDisplay";

import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { MarketDisplayItem } from "@/store/signalr";
const appStore = useAppStore();
const marketDisplayStore = useMarketDisplayStore();

type ConvertibleKeys<T> = {
  [K in keyof T]: T[K] extends string | number ? K : never;
}[keyof T];

type ConvertibleTypes<T> = {
  [K in ConvertibleKeys<T>]: T[K];
};

const props = defineProps({
  class: String,
  style: {
    type: Object,
    required: true,
  },
});

onMounted(() => {
  console.log("Mounted Futures ");
  const url = "/market";
  connect(url);
});
onBeforeUnmount(() => {
  const url = "/market";
  disconnect(url);
});

const openInstruments = ref(false);
const marketMessages = computed(() =>
  appStore.getMarketDisplayData.filter((e) => {
    if (currentSubscriptions.value.length > 0) {
      const found = currentSubscriptions.value.find(
        (b) => b.contract == e.contract
      );
      if (!found) {
        return e;
      }
    } else {
      return e;
    }
  })
);
const instrumentsToAdd = ref(<MarketDisplayItem[]>[]);
const currentSubscriptions = ref(<MarketDisplayItem[]>[]);
const headers: any[] = [
  // { title: "Contract", key: "contract", align: "start" },
  { title: "Date", key: "contractDisplay.contractDate" },
  // { title: "Instrument", key: "contractDisplay.instrument" },
  { title: "Strike", key: "contractDisplay.strike" },
  { title: "Flag", key: "contractDisplay.flag" },
  { title: "Type", key: "contractDisplay.contracT_TYPE" },
  // { title: "C/Display", key: "contractDisplay" },
  {
    title: "Bid",
    key: "bid",
  },
  {
    title: "B/QTY",
    key: "qtyBid",
  },
  { title: "Change", key: "change" },
  { title: "O/QTY", key: "qtyOffer" },
  { title: "Offer", key: "offer" },

  // { title: "Last", key: "last" },
  { title: "Volume", key: "volume" },
];
const connectionState = reactive<{
  connection: HubConnection | null;
  messages: MarketDisplayItem[];
}>({
  connection: null,
  messages: [],
});

const connect = async (endpoint: string) => {
  console.log("Attempt to connect");

  // signalrStore.connect(endpoint);
  connectionState.connection = new HubConnectionBuilder()
    .withUrl(`https://localhost:63125${endpoint}`)
    .withAutomaticReconnect()
    .build();

  await connectionState.connection.start();

  connectionState.connection.on("message", (message: string) => {
    console.log("Socket message ", message);
  });
  connectionState.connection.on("MarketUpdate", (message: string) => {
    console.log("Socket Message ", message);
    try {
      const temp = createTypedObject<MarketDisplayItem>(message);
      console.log("Parsed update : ", message, temp);
      marketDisplayStore.updateItem(temp);
    } catch (err) {
      console.error("error parsing json for ", message, err);
    }
  });
  connectionState.connection.on("marketUpdate", (message: string) => {
    console.log("Socket message ", message);
  });
};
function createTypedObject<T>(data: string): T {
  const parsedData = JSON.parse(data);
  const typedObject: Partial<ConvertibleTypes<T>> = {};

  for (const key in parsedData) {
    const value: T[ConvertibleKeys<T>] = parsedData[
      key
    ] as T[ConvertibleKeys<T>];

    if (typeof value === "string" || typeof value === "number") {
      typedObject[key as keyof ConvertibleTypes<T>] = value;
    } else {
      throw new Error(`Invalid data for field ${key}`);
    }
  }
  return typedObject as T;
}
const subscribeToSelected = () => {
  console.log("Subscribing to : ", instrumentsToAdd);
  connectionState.connection?.invoke(
    "Subscribe",
    instrumentsToAdd.value.map((e) => e.contract)
  );
  instrumentsToAdd.value.forEach((e) => {
    currentSubscriptions.value.push(e);
  });
  instrumentsToAdd.value.splice(0);
};
const disconnect = (endpoint: string) => {
  console.log("Disconnect futures with subs", endpoint);
  connectionState.connection?.stop();
};
</script>
<style lang="scss">
// .v-table > .v-table__wrapper > table > thead > tr > th {
//   padding-left: 5px;
//   padding-right: 5px;
// }
</style>
