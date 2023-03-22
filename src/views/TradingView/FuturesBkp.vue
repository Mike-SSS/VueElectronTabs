<template>
  <v-container
    fluid
    :class="props.class"
    :style="props.style"
  >
    <!-- <v-row>
      <v-col><div class="text-h4">Futures</div></v-col>
    </v-row> -->
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
            <v-btn
              color="primary"
              @click="disconnect(connectionState.connection.baseUrl)"
            >
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
        <v-btn color="primary" @click="connect('/market')"
          >Connect to /market</v-btn
        >
      </v-col>
      <!-- <v-col cols="auto">
        <v-btn color="primary" @click="connect('/marketHeartbeat')">
          Connect to /marketHeartbeat
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" @click="connect('/heartbeat')">
          Connect to /heartbeat
        </v-btn>
      </v-col> -->
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
        <v-data-table-virtual
          width="100%"
          :items="messages[connectionState.endpoint]"
          :headers="headers"
          height="200"
          :show-select="true"
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
  </v-container>
</template>

<script lang="ts" setup>
import { computed, defineProps } from "vue";
import { useLayoutStore } from "@/store/layout";

import { useSignalRStore } from "@/store/signalr";
const signalrStore = useSignalRStore();

const props = defineProps({
  class: String,
  style: {
    type: Object,
    required: true,
  },
});

const connectionStates = computed(() => signalrStore.getConnections);
const messages = computed(() => signalrStore.getMessages);
const headers: any[] = [
  { title: "Contract", key: "Contract", align: "start" },
  {
    title: "Bid",
    key: "Bid",
  },
  {
    title: "B/QTY",
    key: "QtyBid",
  },
  { title: "Change", key: "Change" },
  { title: "O/QTY", key: "QtyOffer" },
  { title: "Offer", key: "Offer" },

  // { title: "Last", key: "last" },
  { title: "Volume", key: "Volume" },
];

const connect = (endpoint: string) => {
  signalrStore.connect(endpoint);
};

const disconnect = (endpoint: string) => {
  console.log("Main disc ", endpoint);
  signalrStore.disconnect(endpoint);
};
</script>
