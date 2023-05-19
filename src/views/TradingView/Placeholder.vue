<template>
  <v-container fluid :class="props.class" :style="props.style">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="auto"
        ><v-btn flat icon color="white"
          ><v-icon color="black">mdi-plus</v-icon>

          <v-menu
            v-model="menu"
            activator="parent"
            :close-on-content-click="false"
            location="right"
          >
            <v-list density="compact" color="green">
              <!-- <v-list-group> -->
              <v-list-item
                v-for="category in categories"
                :key="category.id"
                @click="openSubMenu(category)"
              >
                <v-list-item-title>{{ category.name }}</v-list-item-title>
                <v-menu
                  v-if="category.subMenu"
                  v-model="category.subMenu"
                  activator="parent"
                  location="right"
                >
                  <v-list density="compact">
                    <v-list-item
                      @click="openComponent(item.component)"
                      v-for="item in category.items"
                      :key="item.id"
                    >
                      <v-list-item-title>{{ item.name }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-list-item>
              <!-- </v-list-group> -->
            </v-list>
          </v-menu></v-btn
        ></v-col
      >
    </v-row>
    <!-- <v-row justify="center">
      <v-col cols="auto"><div class="text-h4">Test reactivity</div></v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="auto"
        ><div class="text-h5">Counter: {{ count }}</div></v-col
      >
      <v-col cols="auto">
        <v-btn color="primary" @click="decrease">Decrease</v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" @click="increase">Increase</v-btn>
      </v-col>
    </v-row> -->
  </v-container>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, Ref, defineEmits } from "vue";
import { useLayoutStore } from "@/store/layout";
import componentRegistry, {
  ComponentRegistry,
} from "@/models/componentRegistry";
interface MenuItem {
  id: number;
  name: string;
  subMenu: boolean;
  component?: keyof ComponentRegistry | null;
  items: {
    id: number;
    name: string;
    component: keyof ComponentRegistry | null;
  }[];
}
const menu = ref(false);
const emits = defineEmits(["newComp"]);

const openComponent = (item: keyof ComponentRegistry | null) => {
  emits("newComp", item);
};

const props = defineProps({
  class: String,
  style: {
    type: Object,
    required: true,
  },
});
onMounted(() => {
});
const openSubMenu = (category: MenuItem) => {
  categories.value.forEach((cat) => {
    if (cat.id === category.id) {
      cat.subMenu = !cat.subMenu;
    } else {
      cat.subMenu = false;
    }
  });
};

const open = ref(["Users"]);
const admins = ref([
  ["Management", "mdi-account-multiple-outline"],
  ["Settings", "mdi-cog-outline"],
]);
const categories: Ref<MenuItem[]> = ref([
  {
    id: 1,
    name: "Contracts",
    items: [
      { id: 1, name: "Futures", component: "Futures" as const },
      { id: 2, name: "Options", component: "Options" as const },
      { id: 3, name: "Deltas", component: "Deltas" as const },
      { id: 4, name: "Splits", component: "Splits" as const },
      { id: 5, name: "Spreads", component: "Spreads" as const },
    ],
    subMenu: false,
  },
  {
    id: 2,
    name: "Orders",
    items: [
      { id: 3, name: "Active Orders", component: "ActiveOrders" as const },
      { id: 4, name: "Completed Orders", component: "CompletedOrders" as const },
    ],
    subMenu: false,
  },
  {
    id: 5,
    name: "Positions",
    items: [
      { id: 6, name: "Consolidated positions", component: "ConsolidatedPositions" as const },
      { id: 7, name: "Positions", component: "Positions" as const },
    ],
    subMenu: false,
  },
  {
    id: 8,
    name: "Deals",
    items: [
      // { id: 3, name: "Unsolid Deals", component: "Deals" as const },
      { id: 9, name: "Deals", component: "Deals" as const },
    ],
    subMenu: false,
  },
]);
</script>
