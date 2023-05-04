<template>
  <VContainer fluid :style="props.style" key="Options" class="bg-grey">
    <VRow :class="props.class" justify="space-between" align="center">
      <VCol cols="auto">
        <div class="text-h5">Active Orders {{ filteredData.length }}</div>
      </VCol>
      <VCol>{{ getUniqueValues() }}</VCol>
      <VCol cols="auto">
        <VBtn
          density="compact"
          color="transparent"
          variant="flat"
          icon
          @click="state.openHeaderPicker = true"
          ><VIcon>mdi-table-headers-eye</VIcon></VBtn
        >
        <VTooltip>
          <template v-slot:activator="{ props }">
            <VBtn
              density="compact"
              color="transparent"
              variant="flat"
              v-bind="props"
              icon
              ><VIcon>mdi-information</VIcon></VBtn
            >
          </template>
          <div>Current status</div>
          <div>
            <VIcon
              size="25"
              :color="socket?.state == 'Connected' ? 'success' : 'error'"
              >mdi-circle</VIcon
            >
          </div>
          <div>Current status</div>
        </VTooltip>
        <!-- lable and Add Instrument button here  -->
        <VBtn
          density="compact"
          color="transparent"
          variant="flat"
          icon
          @click="state.openInstruments = true"
          ><VIcon>mdi-plus</VIcon></VBtn
        >
      </VCol>
    </VRow>
    <VRow class="fill-height">
      <VCol cols="12" class="pa-0" ref="Reference">
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
          <template #bottom></template>
          <!-- <v-data-table-footer>Hello</v-data-table-footer> -->
        </v-data-table>
      </VCol>
    </VRow>
    <VDialog
      v-model="state.openHeaderPicker"
      scrollable
      width="auto"
      key="Futures_addInstruments"
    >
      <VCard height="80vh" min-width="300" color="white">
        <VCardTitle class="bg-primary"
          ><VRow justify="space-between" align="center">
            <VCol cols="10" sm="9">Instrument Headers</VCol>
            <VCol cols="2" sm="auto"
              ><VBtn
                @click="state.openHeaderPicker = false"
                size="small"
                icon
                color="transparent"
                flat
              >
                <VIcon icon="mdi-close"></VIcon> </VBtn
            ></VCol> </VRow
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

    <VDialog
      v-model="state.openInstruments"
      scrollable
      width="auto"
      key="Futures_addInstruments"
    >
      <VCard height="80vh" width="80vw">
        <VCardTitle class="bg-primary"
          ><VRow justify="space-between">
            <VCol cols="10"
              >Instrument List ({{
                filteredData ? filteredData.length : -2
              }})</VCol
            >
            <VCol cols="2" sm="auto"
              ><VBtn icon size="20" color="error" flat></VBtn
              ><VBtn
                @click="state.openInstruments = false"
                size="small"
                icon
                color="transparent"
                flat
              >
                <VIcon icon="mdi-close"></VIcon> </VBtn
            ></VCol> </VRow
        ></VCardTitle>
        <VCardSubtitle>
          <VContainer fluid
            ><VRow align="center">
              <VCol cols="4"
                ><VTextField
                  hide-details
                  label="Search"
                  append-inner-icon="mdi-magnify"
                  variant="outlined"
                ></VTextField
              ></VCol>
              <VSpacer></VSpacer>
              <VCol cols="auto"
                ><VBtn
                  @click="subscribeToSelected"
                  :disabled="state.instrumentsToAdd.length == 0"
                  color="primary"
                >
                  Add ({{ state.instrumentsToAdd.length }})</VBtn
                ></VCol
              >
              <VCol cols="auto"
                ><VBtn @click="state.openInstruments = false" color="primary">
                  Done</VBtn
                ></VCol
              >
            </VRow></VContainer
          >
        </VCardSubtitle>
        <VCardText>
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
            <template #item.contractDisplay.strike="{ item }">
              {{ item.value.contractDisplay.strike }}D
            </template>
            
          </v-data-table>
        </VCardText>
        <VCardActions>
          <VBtn color="primary" block @click="state.openInstruments = false"
            >Close Instruments</VBtn
          >
        </VCardActions>
      </VCard>
    </VDialog>
  </VContainer>
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
const appStore = useAppStore();
const mainStore = useActiveOrdersStore();
const { calculateTableHeight, Reference } = useTableHeightCalculator();

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
