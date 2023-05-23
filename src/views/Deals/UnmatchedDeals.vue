<template>
  <v-container fluid :style="props.style" key="Deals" class="bg-grey  d-flex flex-column">
    <v-row :class="props.class" justify="space-between" align="center">
      <v-col cols="auto" class="d-flex align-center">
        <v-btn
          flat
          elevation="0"
          @click="closeComponent"
          icon
          size="20"
          class="mr-2"
          ><v-icon size="14">mdi-close</v-icon></v-btn
        >
        <div class="text-h5">Unmatched Deals ({{ filteredData.length }}) <v-tooltip width="200" activator="parent" location="end">
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
                This is more information on Unmatched deals. Example description
                "All Unmatched deals below"
              </div>
          </v-tooltip></div>
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
          <v-list density="compact" color="primary">
            <v-list-item
              :disabled="state.selectedRows.length != 1"
              @click="openSplits"
              value="split"
              active-class="purple"
              color="primary"
            >
              <v-list-item-title>Split</v-list-item-title>
            </v-list-item>
            <v-list-item
              :disabled="state.selectedRows.length != 2"
              @click="cumulate"
              value="cumulate"
            >
              <v-list-item-title>Cumulate</v-list-item-title>
            </v-list-item>
            <v-list-item
              :disabled="state.selectedRows.length != 1"
              @click="openTripartite"
              value="tripartite"
            >
              <v-list-item-title>Tripartite</v-list-item-title>
            </v-list-item>
            <v-list-item
              :disabled="state.selectedRows.length != 1"
              @click="openAssignMember"
              value="assignToMember"
            >
              <v-list-item-title>Assign to Member</v-list-item-title>
            </v-list-item>
            <v-list-item
              :disabled="state.selectedRows.length != 1"
              @click="openCorrectPrinciple"
              value="correctPrincliple"
            >
              <v-list-item-title>Correct Principle</v-list-item-title>
            </v-list-item>
            <v-list-item
              :disabled="state.selectedRows.length != 1"
              @click="openSubAccount"
              value="subAccount"
            >
              <v-list-item-title>Sub Account</v-list-item-title>
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
        <!--  -->
        <v-data-table
          density="compact"
          :items="filteredData"
          v-model="state.selectedRows"
          :headers="getSortedHeaders"
          item-value="dealSeq"
          item-title="dealSeq"
          return-object
          height="100%"
          fixed-header
          show-select
          @click:row="onRowClicked"
          :items-per-page="-1"
        >
          <template
            v-slot:item.data-table-select="{ item, toggleSelect, isSelected }"
          >
            <v-checkbox-btn
              color="primary"
              :disabled="
                state.selectedRows.length >= 2 &&
                state.selectedRows.find(
                  (e) => e.dealSeq == item.value.dealSeq
                ) == null
              "
              :model-value="isSelected([item])"
              @click.stop.prevent="() => toggleSelect(item)"
            ></v-checkbox-btn>
          </template>
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
    <v-dialog v-model="dialogs.assignMember" width="300">
      <v-card>
        <v-card-title class="bg-primary">Assign member</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              
              <v-col cols="12">
                <v-select density="compact" variant="outlined" label="Member"></v-select>
                <v-text-field density="compact" variant="outlined" label="Price" type="number"></v-text-field>
                <v-text-field density="compact" variant="outlined" label="Ref" type="string"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn density="compact" variant="tonal">Ok</v-btn>
          <v-btn density="compact" variant="tonal">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogs.correctPrinciple" width="300">
      <v-card>
        <v-card-title class="bg-primary">Correct Principle</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              
              <v-col cols="12">
                <v-select density="compact" variant="outlined" label="Principle"></v-select>
                <v-text-field density="compact" variant="outlined" label="Ref" type="string"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn density="compact" variant="tonal">Ok</v-btn>
          <v-btn density="compact" variant="tonal">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogs.splits"
      min-width="300"
      width="auto"
      max-width="500"
    >
      <v-card>
        <v-card-title class="bg-primary">Splits</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="6">
                <v-text-field density="compact" variant="outlined" label="Qty" type="number"></v-text-field>
                <v-text-field density="compact" variant="outlined" label="Price" type="number"></v-text-field>
                <v-text-field density="compact" variant="outlined" label="Ref No" type="string"></v-text-field>
                <v-text-field density="compact" variant="outlined" label="Ref No 2" type="string"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-select density="compact" variant="outlined" label="Principle"></v-select>
                <v-select density="compact" variant="outlined" label="Dealer"></v-select>
                <v-select density="compact" variant="outlined" label="Client Sub Acc"></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" style="border: 1px solid black">
                <v-data-table :items-per-page="-1">
                  <template #bottom></template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn density="compact" variant="tonal">Ok</v-btn>
          <v-btn density="compact" variant="tonal">Cancel</v-btn>
          <v-btn density="compact" variant="tonal">Enter</v-btn>
          <v-btn density="compact" variant="tonal">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogs.tripartite"
      min-width="300"
      width="auto"
      max-width="500"
    >
      <v-card>
        <v-card-title class="bg-primary">Tripartite</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              
              <v-col cols="12">
                <v-select density="compact" variant="outlined" label="Tripartite"></v-select>
                <v-text-field density="compact" variant="outlined" label="Price" type="number"></v-text-field>
                <v-text-field density="compact" variant="outlined" label="Ref" type="string"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn density="compact" variant="tonal">Ok</v-btn>
          <v-btn density="compact" variant="tonal">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogs.subAccount" width="300">
      <v-card>
        <v-card-title class="bg-primary">Sub Account</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="6">
                <v-text-field density="compact" variant="outlined" label="Qty" type="number"></v-text-field>
                <v-text-field density="compact" variant="outlined" label="Price" type="number"></v-text-field>
                <v-text-field density="compact" variant="outlined" label="Ref No" type="string"></v-text-field>
                <v-text-field density="compact" variant="outlined" label="Ref No 2" type="string"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-select density="compact" variant="outlined" label="Principle"></v-select>
                <v-select density="compact" variant="outlined" label="Dealer"></v-select>
                <v-select density="compact" variant="outlined" label="Client Sub Acc"></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" style="border: 1px solid black">
                <v-data-table :items-per-page="-1">
                  <template #bottom></template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn density="compact" variant="tonal">Ok</v-btn>
          <v-btn density="compact" variant="tonal">Cancel</v-btn>
          <v-btn density="compact" variant="tonal">Enter</v-btn>
          <v-btn density="compact" variant="tonal">Delete</v-btn>
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
  Ref,
  reactive,
  onMounted,
  onBeforeUnmount,
} from "vue";
import { useLayoutStore } from "@/store/layout";
import { useAppStore } from "@/store/app";
import { useContractsStore } from "@/store/contracts";
import { useDealsStore } from "@/store/deals";
// import {
//   CustomActiveOrderActions,
//   useCustomActiveOrdersStore,
// } from "@/store/activeOrders";
import { useTableHeightCalculator } from "@/utils/useTableHeightCalculator";

import { useWebSocket } from "@/utils/useWebsocket";
import {
  FilterCondition,
  Deal as MainModel,
  PublishAll,
} from "@/models/marketData";
import { noAuthInstance } from "@/plugins/axios";
import { useCommonComponentFunctions } from "@/utils/commonComponentFunctions";

const appStore = useAppStore();
const mainStore = useDealsStore();
const { calculateTableHeight, Reference } = useTableHeightCalculator();

const emits = defineEmits(["newComp", "closeComp"]);
const { closeComponent } = useCommonComponentFunctions(emits);

const endpoint = "/market";
const filters: FilterCondition[] = [];

type function_type =
  | "Split"
  | "Cumulate"
  | "Assign to Member"
  | "Tripartite"
  | "Correct Principle"
  | "Sub Account";
const functions: Ref<function_type[]> = ref([]);
const dialogs = reactive({
  subAccount: false,
  splits: false,
  correctPrinciple: false,
  tripartite: false,
  assignMember: false
});

const { socket, filteredData, subscribeToSelected, typedArray } =
  useWebSocket<MainModel>(
    useDealsStore,
    endpoint,
    filters,
    {
      name: "DealsInsert",
      func: processUpdate,
    },
    async () => {
      console.log("Deals init function IE publish all deals??");
      if (socket.value) {
        console.log("Has socket");
        socket.value?.invoke("PublishAllData", PublishAll.Deals);
      }
    }
  );

function openSplits() {
  console.log("Open splits");
  dialogs.splits = true;
}
function openCorrectPrinciple() {
  console.log("Correct Principle");
  dialogs.correctPrinciple = true;
}
function cumulate() {
  console.log("Cumulate");
}
function openTripartite() {
  console.log("Open triparte");
  dialogs.tripartite = true;
}
function openSubAccount() {
  console.log("Open sub account");
  dialogs.subAccount = true;
}
function openAssignMember() {
  console.log("Open assign member");
  dialogs.assignMember = true;
}
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
function onRowClicked(e: any, a: any) {
  console.log("Clicked on row - a - ", a);
  console.log("Clicked on row - e - ", e);
}
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
const headers = ref([
  // { title: "Contract", key: "contract", align: "start" },
  { title: "Deal Time", key: "dealTime" },
  { title: "Member", key: "member" },
  { title: "Principal", key: "principal" },
  { title: "Instrument", key: "contractDisplay.instrument" },
  { title: "Date", key: "contractDisplay.contractDate" },
  { title: "Dealer", key: "dealer" },
  { title: "Buy/Sell", key: "buySell" },
  {
    title: "QTY",
    key: "quantity",
  },
  { title: "Rate", key: "dealtRate" },
  { title: "Origin", key: "origin" },
  { title: "Principle Agency", key: "principleAgency" },
]);
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
  openInstruments: false,
  selectedRows: [],
  selectedHeaders: headers.value.concat([]),
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
