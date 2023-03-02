<template>
  <v-container fluid>
    <v-row>
      <v-col class="d-flex flex-column align-center"
        ><v-img contain height="100" width="auto" src="@/assets/logo.svg" />

        <div class="text-body-2 font-weight-light mb-n1">Welcome to</div>

        <h1 class="text-h2 font-weight-bold">BVG Trader</h1>

        <div class="py-7"
      /></v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="10">
        <!-- <template>
            <div> -->
        <v-list>
          <v-list-item
            v-for="connectionState in connectionStates"
            :key="
              connectionState.connection.connectionId
                ? connectionState.connection.connectionId
                : Math.random()
            "
            :title="'Endpoint: ' + connectionState.connection.baseUrl"
          >
            <!-- <v-list>
                <v-list-item
                  v-for="message in messages[connectionState.endpoint]"
                  :key="message.id"
                  :title="'Message: '"
                  :subtitle="message.text"
                >
                </v-list-item>
              </v-list> -->
            <v-btn @click="disconnect(connectionState.connection.baseUrl)">
              Disconnect
            </v-btn>
          </v-list-item>
        </v-list>
        <!-- <ul class="green">
            <li
              v-for="connectionState in connectionStates"
              :key="
                connectionState.connection.connectionId
                  ? connectionState.connection.connectionId
                  : Math.random()
              "
            >
              Endpoint: {{ connectionState.connection.baseUrl }} <br />
              Messages:
              <ul>
                <li v-for="message in connectionState.messages" :key="message">
                  {{ message }}
                </li>
              </ul>
              <v-btn @click="disconnect(connectionState.connection.baseUrl)">
                Disconnect
              </v-btn>
            </li>
          </ul> -->
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="auto">
        <v-btn @click="connect('/market')">Connect to /market</v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn @click="connect('/marketHeartbeat')">
          Connect to /marketHeartbeat
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn @click="connect('/heartbeat')"> Connect to /heartbeat </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        v-for="connectionState in connectionStates"
        :key="
          connectionState.connection.connectionId
            ? connectionState.connection.connectionId
            : Math.random()
        "
      >
        <v-data-table
          width="100%"
          :items="messages[connectionState.endpoint]"
          :headers="headers"
          item-value="group"
          :items-per-page="-1"
        >
          <!-- <template #default="props">
              <tr>
                <th v-for="head in props" :key="head.key">{{ head }}</th>
              </tr>
            </template> -->
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useSignalRStore } from "@/store/signalr";
import { VDataTable } from "vuetify/labs/components";
// export type VDataTableHeaderProps = Extract<
//   VDataTable["$props"]["headers"][number],
//   DataTableHeader[]
// >[number];
import { computed } from "vue";

const signalrStore = useSignalRStore();

const connectionStates = computed(() => signalrStore.getConnections);
const messages = computed(() => signalrStore.getMessages);
const headers: any[] = [
  { title: "Contract", key: "group", align: "start" },
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

  { title: "Last", key: "last" },
  { title: "Volume", key: "volume" },
];

const connect = (endpoint: string) => {
  signalrStore.connect(endpoint);
};

const disconnect = (endpoint: string) => {
  console.log("Main disc ", endpoint);
  signalrStore.disconnect(endpoint);
};
</script>
