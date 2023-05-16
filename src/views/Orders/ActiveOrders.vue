<template>
  <v-container fluid :style="props.style" key="ActiveOrders" class="bg-grey  d-flex flex-column">
    <v-row :class="props.class" justify="space-between" align="center">
      <v-col cols="auto" class="d-flex align-center">
        <v-btn @click="closeComponent" icon size="20" class="mr-2"
          ><v-icon size="12">mdi-close</v-icon></v-btn
        >
        <div class="text-h5">
          Active Orders ({{ filteredData.length }})
          <v-tooltip width="200" activator="parent" location="end">
              <div class="d-flex align-center">
                <v-icon
                  size="15"
                  class="mr-2"
                  :color="socket?.state == 'Connected' ? 'success' : 'error'"
                  >mdi-circle</v-icon
                >
                <div>WS: {{ socket?.state }}</div>
              </div>
              <div class="text-body-1">
                This is more information on active order. Example description
                "All active orders below"
              </div>
          </v-tooltip>
        </div>
      </v-col>
      <v-col>{{ getUniqueValues() }}</v-col>
      <v-col cols="auto">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              density="compact"
              color="transparent"
              variant="flat"
              icon
              v-bind="props"
              ><v-icon>mdi-function-variant</v-icon></v-btn
            >
          </template>
          <v-list density="compact" active-color="primary" color="pink">
            <v-list-item
              value="deleteAll"
              active-class="purple"
              color="primary"
            >
              <v-list-item-title>Delete All</v-list-item-title>
            </v-list-item>
            <v-list-item value="suspendAll">
              <v-list-item-title>Suspend All</v-list-item-title>
            </v-list-item>
            <v-list-item value="deleteOrder">
              <v-list-item-title>Delete Order</v-list-item-title>
            </v-list-item>
            <v-list-item value="reduceOrder">
              <v-list-item-title>Reduce Order</v-list-item-title>
            </v-list-item>
            <v-list-item value="suspendOrder">
              <v-list-item-title>Suspend Order</v-list-item-title>
            </v-list-item>
            <v-list-item value="changePrice">
              <v-list-item-title>Change Price</v-list-item-title>
            </v-list-item>
            <v-list-item value="editSuspended">
              <v-list-item-title>Edit suspended order</v-list-item-title>
            </v-list-item>
            <v-list-item value="editSuspended">
              <v-list-item-title>Re-submit suspended order</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
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
      <v-col cols="12" class="pa-0 fill-height" ref="Reference">
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
          <!-- <v-data-table-footer>Hello</v-data-table-footer> -->
        </v-data-table>
      </v-col>
    </v-row>
    <VDialog
      v-model="state.openHeaderPicker"
      scrollable
      width="auto"
      key="Futures_addInstruments"
    >
      <VCard height="80vh" min-width="300" color="white">
        <VCardTitle class="bg-primary"
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
        ></VCardTitle>
        <VCardText>
          <VList>
            <VListItem
              lines="one"
              v-for="header in headers"
              :key="header.title"
              :title="header.title"
              :id="header.title"
            >
              <template v-slot:prepend>
                <VListItemAction start>
                  <VCheckboxBtn
                    @change="updateHeader($event, header)"
                    :model-value="state.selectedHeaders.find((e: any) => e.key == header.key) != null"
                  ></VCheckboxBtn>
                </VListItemAction>
              </template>
            </VListItem>
          </VList>
        </VCardText>
      </VCard>
    </VDialog>    
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
import { useActiveOrdersStore } from "@/store/activeOrders";
// import {
//   CustomActiveOrderActions,
//   useCustomActiveOrdersStore,
// } from "@/store/activeOrders";
import { useTableHeightCalculator } from "@/utils/useTableHeightCalculator";

import { useWebSocket } from "@/utils/useWebsocket";
import {
  FilterCondition,
  ActiveOrder as MainModel,
  PublishAll,
} from "@/models/marketData";
import { noAuthInstance } from "@/plugins/axios";
import { useCommonComponentFunctions } from "@/utils/commonComponentFunctions";
const appStore = useAppStore();
const mainStore = useActiveOrdersStore();
const { calculateTableHeight, Reference } = useTableHeightCalculator();

const emits = defineEmits(["newComp", "closeComp"]);
const { closeComponent } = useCommonComponentFunctions(emits);

const endpoint = "/market";
const filters: FilterCondition[] = [];

const { socket, filteredData, subscribeToSelected, typedArray } =
  useWebSocket<MainModel>(
    useActiveOrdersStore,
    endpoint,
    filters,
    {
      name: "ActiveOrderUpdate",
      func: processUpdate,
    },
    async () => {
      console.log("Active Order init function IE publish all active orders");
      if (socket.value) {
        console.log("Has socket");
        socket.value?.invoke("PublishAllData", PublishAll.ActiveOrders);
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
// const instrumentsToAdd = ref(<MarketDisplayItem[]>[]);
// const currentSubscriptions = ref(<MarketDisplayItem[]>[]);
const headers: any[] = [
  // { title: "Contract", key: "contract", align: "start" },
  { title: "Enter Time", key: "enterTime", order: 1 },
  {
    title: "Contract",
    key: "contractDisplay.contractDisplay",
  },
  { title: "Principal", key: "userCode" },
  { title: "Sub Acc", key: "subAccount" },
  { title: "Member", key: "member" },
  { title: "Dealer", key: "dealer" },
  { title: "Buy/Sell", key: "buySell" },
  { title: "Order State", key: "orderState" },
  {
    title: "QTY",
    key: "quantity",
    order: 2,
  },

  { title: "Rate", key: "rate" },
  { title: "O/QTY", key: "originalQuantity" },
  { title: "Principle Agency", key: "principleAgency" },
];
const getSortedHeaders = computed(() =>
  state.selectedHeaders.sort((a, b) => (a.order < b.order ? -1 : 1))
);
const state = reactive<{
  openHeaderPicker: boolean;
  openInstruments: boolean;
  selectedHeaders: any[];
  selectedRows: MainModel[];
  currentSubscriptions: MainModel[];
  instrumentsToAdd: MainModel[];
}>({
  openHeaderPicker: false,
  selectedRows: [],
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
