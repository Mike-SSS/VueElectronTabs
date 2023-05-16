<template>
  <v-container fluid :style="props.style" key="Options" class="bg-grey d-flex flex-column">
    <v-row :class="props.class" justify="space-between" align="center">
      <v-col cols="auto" class="d-flex align-center">
        <v-btn @click="closeComponent" icon size="20" class="mr-2"><v-icon size="12">mdi-close</v-icon></v-btn>
        <div class="text-h5">Completed Orders ({{ filteredData.length }})</div>
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
      </v-col>
    </v-row>
    <v-row class="fill-height">
      <v-col cols="12" class="pa-0" ref="Reference">
        <v-data-table
          density="compact"
          :items="filteredData"
          :headers="getSortedHeaders"
          :height="calculateTableHeight"
          fixed-header
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
      key="completedOrders_headers"
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
import { useCompletedOrdersStore } from "@/store/completedOrders";
import { useTableHeightCalculator } from "@/utils/useTableHeightCalculator";

import { useWebSocket } from "@/utils/useWebsocket";
import {
  FilterCondition,
  CompletedOrder as MainModel,
  PublishAll,
} from "@/models/marketData";
import { noAuthInstance } from "@/plugins/axios";
import { useCommonComponentFunctions } from "@/utils/commonComponentFunctions";
const appStore = useAppStore();
const mainStore = useCompletedOrdersStore();
const { calculateTableHeight, Reference } = useTableHeightCalculator();

const emits = defineEmits(['newComp', 'closeComp']);;
const { closeComponent } = useCommonComponentFunctions(emits);

const endpoint = "/market";

const filters: FilterCondition[] = [];
const { socket, filteredData, subscribeToSelected, typedArray } = useWebSocket<MainModel>(
  useCompletedOrdersStore,
  endpoint,
  filters,
  {
    name: "CompletedOrderUpdate",
    func: processUpdate,
  },
  async () => {
    console.log("Completed Order init function IE publish all active orders");
    if (socket.value) {
      console.log("Has socket");
      socket.value?.invoke("PublishAllData", PublishAll.CompletedOrders);
      // const res = await noAuthInstance.get("/api/download/publishall", {
      //   params: {
      //     publish: true,
      //     enumVal: PublishAll.CompletedOrders,
      //   },
      // });
      // if (res) {
      //   console.log("Publish Completed orders ", res.data);
      // }
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
  console.log("Mounted Deltas");
});
onBeforeUnmount(() => {});

function getUniqueValues() {
  // const field = "contractDisplay";
  // const child = "flag";
  // return filteredData.value.reduce((unique: string[], item: MainModel) => {
  //   if (!unique.includes(<string>item[field][child])) {
  //     unique.push(<string>item[field][child]);
  //   }
  //   return unique;
  // }, []);
}
const headers: any[] = [
  { title: "Enter Date", key: "enterDate" },
  { title: "Enter Time", key: "enterTime"  },
  { title: "Rate", key: "rate", },
  { title: "Spot Price", key: "spotPrice"  },
  { title: "U/Member", key: "userMember" },
  { title: "U/Dealer", key: "userDealer" },
  { title: "Clearing Member", key: "clearingMember" },
  { title: "Member", key: "member" },
  { title: "Dealer", key: "dealer" },
  { title: "Buy/Sell", key: "buySell" },
  { title: "Reason", key: "reason" },
  {
    title: "QTY",
    key: "qty",
    order: 2,
  },
  {
    title: "contract",
    key: "contract",
    order: 3,
  },
  { title: "Principle Agency", key: "principleAgency", order: 5 },
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
</script>
<style lang="scss">
// .v-table > .v-table__wrapper > table > thead > tr > th {
//   padding-left: 5px;
//   padding-right: 5px;
// }
</style>
