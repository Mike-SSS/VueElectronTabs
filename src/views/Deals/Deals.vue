<template>
  <v-container
    fluid
    :style="props.style"
    key="Deals"
    class="bg-grey d-flex flex-column"
  >
    <CommonToolbar
      :socket-state="socket?.state"
      :class="props.class"
      :close-component="closeComponent"
      :data-length="filteredData.length"
      :action-buttons="actionButtons"
      title="Deals"
      tooltip="This is more information on Deals. Example description"
    ></CommonToolbar>
    <!-- <v-row :class="props.class" justify="space-between" align="center">
      <v-col cols="auto" class="d-flex align-center">
        <CloseComponentButton
          :closeComponent="closeComponent"
        ></CloseComponentButton>
        <div class="text-h4">
          Deals ({{ filteredData.length }})
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
              This is more information on deals. Example description "All deals
              below"
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
          <v-list density="compact" color="primary" color="pink">
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
    </v-row> -->
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
              style="font-size: 0.5rem"
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
          <!-- <template
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
          </template> -->
          <template #bottom></template>
        </v-data-table>
      </v-col>
    </v-row>
    <HeaderPicker
      v-model="state.openHeaderPicker"
      v-model:tableHeaders.sync="headers"
      v-model:selectedHeaders.sync="state.selectedHeaders"
    ></HeaderPicker>
    <AssignMemberModal
      v-model="dialogs.assignMember"
      :item="state.selectedRows[0]"
    ></AssignMemberModal>
    <CorrectPrincipleModal
      v-model="dialogs.correctPrinciple"
      :item="state.selectedRows[0]"
    ></CorrectPrincipleModal>
    <SplitModal v-model="dialogs.splits" :item="state.selectedRows[0]">
    </SplitModal>
    <TripartiteModal
      v-model="dialogs.tripartite"
      :item="state.selectedRows[0]"
    ></TripartiteModal>
    <SubAccountModal
      v-model="dialogs.subAccount"
      :item="state.selectedRows[0]"
    ></SubAccountModal>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, ref, Ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useLayoutStore } from "@/store/layout";
import { useAppStore } from "@/store/app";
import { useDealsStore } from "@/store/deals";
import CloseComponentButton from "@/components/CloseComponentButton.vue";
// import {
//   CustomActiveOrderActions,
//   useCustomActiveOrdersStore,
// } from "@/store/activeOrders";
import SubAccountModal from "@/components/DealModals/SubAccount.vue";
import TripartiteModal from "@/components/DealModals/Tripartite.vue";
import SplitModal from "@/components/DealModals/Splits.vue";
import CorrectPrincipleModal from "@/components/DealModals/CorrectPrinciple.vue";
import HeaderPicker from "@/components/HeaderPicker.vue";
import AssignMemberModal from "@/components/DealModals/AssignMember.vue";
import { useTableHeightCalculator } from "@/utils/useTableHeightCalculator";

import { useWebSocket } from "@/utils/useWebsocket";
import {
  FilterCondition,
  Deal as MainModel,
  PublishAll,
} from "@/models/marketData";
import { noAuthInstance } from "@/plugins/axios";
import { useCommonComponentFunctions } from "@/utils/commonComponentFunctions";

import CommonToolbar from "@/components/CommonToolbar.vue";
import { ActionButton } from "@/models/UI";
import { MarketDisplayStoreActions } from "@/store/marketDisplay";

const appStore = useAppStore();
const mainStore = useDealsStore();
const { calculateTableHeight, Reference } = useTableHeightCalculator();

const emits = defineEmits(["newComp", "closeComp"]);
const { closeComponent } = useCommonComponentFunctions(emits);

const endpoint = "/market";
const filters: FilterCondition[] = [];

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

function test(): void {
  console.log("Testing");
}
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
  assignMember: false,
});

const actionButtons = computed<ActionButton[]>(() => [
  {
    id: "1",
    tooltip: "Split",
    color: "white",
    disabled: state.selectedRows.length != 1,
    variant: "tonal",
    density: "compact",
    icon: "mdi-arrow-split-vertical",
    textField: null,
    action: () => {
      // get selected row and pass as param
      openSplits();
    },
  },
  {
    id: "2",
    tooltip: "Cumulate",
    color: "white",
    disabled: state.selectedRows.length != 2,
    variant: "tonal",
    density: "compact",
    icon: "mdi-link-plus",
    textField: null,
    action: () => {
      // get selected row and pass as param
      cumulate();
    },
  },
  {
    id: "3",
    tooltip: "Tripartite",
    disabled: state.selectedRows.length != 1,
    color: "white",
    variant: "tonal",
    density: "compact",
    icon: "mdi-layers-triple-outline",
    textField: null,
    action: () => {
      // get selected row and pass as param
      openTripartite();
    },
  },
  {
    id: "4",
    tooltip: "Assign to Memeber",
    disabled: state.selectedRows.length != 1,
    color: "white",
    variant: "tonal",
    density: "compact",
    icon: "mdi-account-tag-outline",
    textField: null,
    action: () => {
      // get selected row and pass as param
      openAssignMember();
    },
  },
  {
    id: "5",
    tooltip: "Correct Principle",
    disabled: state.selectedRows.length != 1,
    color: "white",
    variant: "tonal",
    density: "compact",
    icon: "mdi-auto-fix",
    textField: null,
    action: () => {
      // get selected row and pass as param
      openCorrectPrinciple();
    },
  },
  {
    id: "6",
    tooltip: "Sub Account",
    disabled: state.selectedRows.length != 1,
    color: "white",
    variant: "tonal",
    density: "compact",
    icon: "mdi-account-child-outline",
    textField: null,
    action: () => {
      // get selected row and pass as param
      openSubAccount();
    },
  },
  {
    id: "7",
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

const { socket, filteredData, subscribeToSelected, typedArray } = useWebSocket<
  MainModel,
  {}
>(
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

const getSortedHeaders = computed(
  () =>
    // state.selectedHeaders.sort((a, b) => (a.order < b.order ? -1 : 1))
    state.selectedHeaders
);
</script>
<style lang="scss">
// .v-table > .v-table__wrapper > table > thead > tr > th {
//   padding-left: 5px;
//   padding-right: 5px;
// }
</style>
