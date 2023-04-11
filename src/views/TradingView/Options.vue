<template>
  <v-container fluid :style="props.style" key="Options" class="bg-grey">
    <v-row :class="props.class" justify="space-between" align="center">
      <v-col cols="auto">
        <div class="text-h5">Options</div>
      </v-col>
      <v-col>{{ getUniqueValues() }}</v-col>
      <v-col cols="auto">
        <v-btn
          density="compact"
          color="transparent"
          variant="flat"
          icon
          @click="state.openHeaderPicker = true"
          ><v-icon>mdi-table-headers-eye</v-icon></v-btn
        >
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
          @click="state.openInstruments = true"
          ><v-icon>mdi-plus</v-icon></v-btn
        >
      </v-col>
    </v-row>
    <v-row class="fill-height">
      <v-col cols="12" class="pa-0" ref="ResizeHeight">
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
                marketMessages ? marketMessages.length : -2
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
            :items="marketMessages"
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
import { useLayoutStore } from "@/store/layout";
import { useAppStore } from "@/store/app";
import { useContractsStore } from "@/store/contracts";

import { instance } from "@/plugins/axios";

import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { MarketDisplayItemContract as MainModel } from "@/models/marketData";
const appStore = useAppStore();
const mainStore = useContractsStore();

type ConvertibleKeys<T> = {
  [K in keyof T]: T[K] extends string | number | object ? K : never;
}[keyof T];

type ConvertibleTypes<T> = {
  [K in ConvertibleKeys<T>]: T[K] extends object
    ? ConvertibleTypes<T[K]>
    : T[K];
};

const props = defineProps({
  class: String,
  style: {
    type: Object,
    required: true,
  },
});

const tableHeight = ref(0);
const ResizeHeight = ref();

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
  const url = "/market";
  connect(url);

  tableHeight.value = calculateTableHeight.value;
  window.addEventListener("resize", onWindowResize);
});
onBeforeUnmount(() => {
  const url = "/market";
  disconnect(url);
  window.removeEventListener("resize", onWindowResize);
});

function getUniqueValues() {
  const field = "contractDisplay";
  const child = "flag";
  return marketMessages.value.reduce(
    (unique: string[], item: MainModel) => {
      item;
      if (!unique.includes(<string>item[field][child])) {
        unique.push(<string>item[field][child]);
      }
      return unique;
    },
    []
  );
}
const filtered = computed(() =>
  marketMessages.value
    .filter((e) => {
      if (
        e.contractDisplay.instrument == "SOYA" &&
        e.contractDisplay.contractDate == "APR23"
      ) {
        return e;
      }
      return false;
    })
    .map((e) => ({
      contract: e.contract,
      seq: e.contractSeq,
      display: e.contractDisplay,
    }))
);
const marketMessages = computed(() =>
  mainStore.getMarketDisplayData.filter((e) => {
    // if (e instanceof ComponentModel)
    if (e.contractDisplay.flag == "F") return false;
    if (e.contractDisplay.contracT_TYPE !== 2) return false;

    // apply text filter here

    if (state.currentSubscriptions.length > 0) {
      const found = state.currentSubscriptions.find(
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

const calculateTableHeight = computed(() => {
  console.log("Options: ", ResizeHeight.value);
  if (ResizeHeight && ResizeHeight.value) {
    const col = ResizeHeight.value.$el as HTMLElement;
    const height = col.clientHeight;
    console.log("Height :", height, col.clientHeight, col);
    // return height;
    const header = col.querySelector("thead") as HTMLElement;
    const pagination = col.querySelector(".v-data-table-footer") as HTMLElement;
    console.log("Check: ", header, pagination);
    const paginationHeight = pagination ? pagination.offsetHeight : 0;

    const result = height - paginationHeight - 20;
    console.log("Returned height: ", result, paginationHeight);
    return result;
  } else {
    return 0;
  }
});

const onWindowResize = () => {
  tableHeight.value = calculateTableHeight.value;
};
// const instrumentsToAdd = ref(<MarketDisplayItem[]>[]);
// const currentSubscriptions = ref(<MarketDisplayItem[]>[]);
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

const connectionState = reactive<{
  connection: HubConnection | null;
  messages: MainModel[];
}>({
  connection: null,
  messages: [],
});

const connect = async (endpoint: string) => {
  console.log("Attempt to connect");

  // signalrStore.connect(endpoint);
  connectionState.connection = new HubConnectionBuilder()
    .withUrl(`${import.meta.env.VITE_APP_API_URL}${endpoint}`)
    .withAutomaticReconnect()
    .build();

  await connectionState.connection
    .start()
    .then(async () => {
      // init data here for each panel
      console.log("Socket connected here");
      if (connectionState.connection) {
        connectionState.connection.on("MarketInit", (message: any) => {
          console.log("Inner market init Message ", message);
          try {
            const temp = createTypedObject<MainModel>(message);
            console.log("Parsed update : ", message, temp);
            mainStore.updateItem(temp);
          } catch (err) {
            console.error("error parsing json for ", message, err);
          }
        });
        console.log("Invoke market init");
        // connectionState.connection.invoke("PublishAll");
        const res = await instance.get("/api/download/publishall");
        if (res) {
          console.log("Publish all Result ", res.data);
        }
      }
    })
    .catch((err) => {
      console.error("Error starting socket ", err);
    });

  connectionState.connection.on("connected", (message: string) => {
    console.log(
      "Socket connected ",
      message,
      connectionState.connection?.connectionId
    );
  });

  connectionState.connection.on("message", (message: string) => {
    console.log("Socket message ", message);
  });

  connectionState.connection.on("MarketUpdate", (message: string) => {
    console.log("Socket Message ", message);
    try {
      const temp = createTypedObject<MainModel>(message);
      console.log("Parsed update : ", message, temp);
      mainStore.updateItem(temp);
    } catch (err) {
      console.error("error parsing json for ", message, err);
    }
  });
  connectionState.connection.on("marketUpdate", (message: string) => {
    console.log("Socket message ", message);
  });
};
function createTypedObject<T>(data: string | object): T {
  const parsedData = typeof data === "string" ? JSON.parse(data) : data;
  const typedObject: Partial<T> = {};

  for (const key in parsedData) {
    const value = parsedData[key];

    if (typeof value === "string" || typeof value === "number") {
      typedObject[key as keyof T] = value as T[keyof T];
    } else if (typeof value === "object") {
      typedObject[key as keyof T] = createTypedObject<T[keyof T]>(
        value
      ) as T[keyof T];
    } else {
      throw new Error(`Invalid data for field ${key}`);
    }
  }
  return typedObject as T;
}
const subscribeToSelected = () => {
  console.log("Subscribing to : ", state.instrumentsToAdd);
  connectionState.connection?.invoke(
    "Subscribe",
    state.instrumentsToAdd.map((e) => e.contract)
  );
  state.instrumentsToAdd.forEach((e) => {
    state.currentSubscriptions.push(e);
  });
  state.instrumentsToAdd.splice(0);
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
