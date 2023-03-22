<template>
  <v-container fluid :class="props.class" :style="props.style" key="Futures">
    <v-row justify="space-between" align="center">
      <v-col cols="auto">
        <div class="text-h5">Futures</div>
      </v-col>
      <v-col cols="auto">
        <!-- lable and Add Instrument button here  -->
        <v-btn color="primary" @click="openInstruments = true"
          >Add Instruments</v-btn
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table-virtual
          width="100%"
          :items="[]"
          :headers="headers"
          height="200"
        >
          <!-- <template #default="props">
              <tr>
                <th v-for="head in props" :key="head.key">{{ head }}</th>
              </tr>
            </template> -->
          <!-- <template v-slot:column.Column="{ column }">
            {{ column.title.toUpperCase() }}
          </template> -->
        </v-data-table-virtual>
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
            :items="marketMessages"
            v-model="instrumentsToAdd"
            :headers="headers"
            :group-by="[{ key: 'contractDisplay.instrument' }]"
            height="60vh"
            show-select
            fixed-header
            item-value="contract"
            :items-per-page="-1"
          >
            <!-- :group-by="[{ key: 'contractDisplay.instrument' }]" -->
            <template
              v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }"
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
          <v-btn color="primary" block @click="openInstruments = false"
            >Close Instruments</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, defineProps, ref, reactive } from "vue";
import { useLayoutStore } from "@/store/layout";
import { useAppStore } from "@/store/app";

import { MarketDisplayItem, useSignalRStore } from "@/store/signalr";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
const signalrStore = useSignalRStore();
const appStore = useAppStore();

const props = defineProps({
  class: String,
  style: {
    type: Object,
    required: true,
  },
});
const openInstruments = ref(false);
const marketMessages = computed(() => appStore.getMarketDisplayData);
const connectionStates = computed(() => signalrStore.getConnections);
const messages = computed(() => signalrStore.getMessages);
const instrumentsToAdd = ref(<string[]>[]);
const headers: any[] = [
  { title: "Contract", key: "contract", align: "start" },
  { title: "C/Display", key: "contractDisplay.contractDate" },
  { title: "Instrument", key: "contractDisplay.instrument" },
  { title: "Strike", key: "contractDisplay.strike" },
  { title: "Flag", key: "contractDisplay.flag" },
  { title: "Type", key: "contractDisplay.contracT_TYPE" },
  { title: "C/Display", key: "contractDisplay" },
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
      console.log()
    })
};
const subscribeToSelected = () => {
  instrumentsToAdd.value.forEach((e) => {
    console.log("Yolo subscribe ", e);
  });
};
const disconnect = (endpoint: string) => {
  console.log("Main disc ", endpoint);
  signalrStore.disconnect(endpoint);
};
</script>
