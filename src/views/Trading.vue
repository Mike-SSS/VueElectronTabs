<template>
  <v-navigation-drawer
    color="primary"
    permanent
    rail-width="60"
    :rail="true"
    width="200"
    location="left"
  >
    <v-list density="compact">
      <v-list-item
        prepend-icon="mdi-fire"
        title="Home"
        value="home"
        :to="{
          name: 'Login',
        }"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-cash"
        title="My Account"
        value="account"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-cart-variant"
        title="Users"
        value="users"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-chart-gantt"
        title="Users"
        value="users"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-chart-timeline-variant-shimmer"
        title="Users"
        value="users"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-cog"
        title="Users"
        value="users"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-container fluid class="fill-height">
    <!-- <v-row
      :style="{
        width: '100%',
      }"
      v-if="currentLayout"
    >
      <v-col
        v-for="(col, index) in currentLayout.columns"
        :cols="col.width"
        :class="`bg-` + col.color"
        :style="styles[index]"
        height="auto"
      >
        <v-card width="100%" :color="col.color" :height="col.height * 10">{{
          col.color
        }}</v-card>
      </v-col>
    </v-row> -->

    <!-- <div class="grid-container" v-if="currentLayout">
        <div
          v-for="(col, index) in currentLayout.columns"
          class="grid-item"
          :class="`bg-` + col.color"
          :style="col.grid"
          :key="col.id"
        >
          Item {{ index }}
          <keep-alive
            ><component
              v-if="col.component != null"
              :key="col.component"
              :is="componentRegistry[col.component]"
              v-bind="col.props"
            />
            <div v-else class="text-h5">
              No component loaded yet
            </div></keep-alive
          >
        </div>
    </div> -->
    <div class="grid-container" v-if="currentLayout">
      <!-- v-bind="col.props ? col.props : {
            style: { }
          }" -->
      <keep-alive>
        <component
          v-for="(col, index) in currentLayout.columns"
          :class="`bg-` + col.color"
          :style="col.grid"
          :key="
            col.component
              ? col.component.toString()
              : (Math.random() * 100).toString()
          "
          :is="
            col.component
              ? componentRegistry[col.component]
              : componentRegistry['Placeholder']
          "          
          @newComp="onNewComp($event, col)"
          @closeComp="closeComp(col)"
          
        >
        </component>
      </keep-alive>
    </div>
    <v-row v-else justify="center">
      <v-col cols="10">
        <v-card min-height="400">
          <v-card-text>
            <div class="text-h4 mb-4">Welcome!</div>
            <div class="text-h6 mb-4">Select Layout to continue</div>
            <div class="text-body-1 mb-4">
              In tincidunt vitae ipsum sit amet sollicitudin. Phasellus luctus
              condimentum eros vitae laoreet. Quisque non mollis dui, ut rhoncus
              ex. Aenean facilisis ante felis, gravida rutrum tellus finibus ut.
              Phasellus nulla enim, dignissim mollis metus nec, imperdiet
              gravida ipsum.
            </div>
            <div class="text-body-1">
              Etiam efficitur libero eget nisl laoreet, at gravida lacus
              elementum. Proin vel efficitur nisl. Donec porta, ex sit amet
              sodales auctor, libero ipsum suscipit enim, nec congue lectus
              nulla sit amet ante. Vestibulum nulla ligula, fermentum non
              iaculis iaculis, cursus ut nulla. Morbi ullamcorper nunc eu lorem
              consequat auctor. Praesent ligula nunc, dignissim vel lorem nec,
              tincidunt viverra ipsum. Interdum et malesuada fames ac ante ipsum
              primis in faucibus.
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useLayoutStore } from "@/store/layout";
import LayoutTest from "@/components/LayoutTest.vue";
import componentRegistry, {
  ComponentRegistry,
} from "@/models/componentRegistry";
import { COLUMN } from "@/models/layout";

const storeLayout = useLayoutStore();

const currentLayout = computed(() => storeLayout.currentLayout);

const onNewComp = (event: keyof ComponentRegistry, item: COLUMN): void => {
  console.log("On New Comp ", event, item.id);
  storeLayout.changeColumnComponent(event, item.id);
};

function closeComp(col: COLUMN) {
  console.log("Close column comp ", col.component);
  col.component = null;
}
</script>

<style lang="scss">
.grid-container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(12, 1fr);
  grid-gap: 10px;
  width: 100%;
  height: 100%;
}
/* .grid-container-mini {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(12, 1fr);
  grid-gap: 2px;
  width: 100%;
  height: 100%;
} */

.grid-item {
  background-color: lightgray;
  /* padding: 10px;
  font-size: 20px; */
  overflow-y: auto;
  text-align: center;
}

/* @media screen and (max-width: 600px) {
  .grid-container {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
} */
.v-data-table__tr.v-data-table__tr--clickable:hover {
  .v-data-table__td {
    background: lightgreen;
  }
}
.v-list-item:hover > .v-list-item__overlay {
  background: green;
    opacity: calc(0.5 * var(--v-theme-overlay-multiplier));
}
.v-data-table {
  max-height: 100%;
  height: 100%;
}
</style>
