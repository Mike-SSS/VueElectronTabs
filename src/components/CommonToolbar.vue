<template>
  <v-row :class="props.class" justify="start" align="center">
    <v-col cols="auto" class="d-flex align-center">
      <CloseComponentButton
        :close-component="closeComponent"
      ></CloseComponentButton>
      <div class="text-h5">
        {{ title }} ({{ dataLength }})
        <v-tooltip width="200" activator="parent" location="end">
          <div class="d-flex align-center">
            <v-icon
              size="15"
              class="mr-2"
              :color="socketState == 'Connected' ? 'success' : 'error'"
              >mdi-circle</v-icon
            >
            <div>WS: {{ socketState }}</div>
          </div>
          <div class="text-body-1">
            {{ tooltip }}
          </div>
        </v-tooltip>
      </div>
    </v-col>
    <DynamicToolbarActionsHandler
      :buttons="actionButtons"
    ></DynamicToolbarActionsHandler>
  </v-row>
  <!-- <v-col cols="auto">
        <v-tooltip text="Edit Order">
          <template v-slot:activator="{ props }">
            <v-btn
              color="white"
              variant="tonal"
              density="compact"
              icon="mdi-text-box-edit"
              v-bind="props"
            ></v-btn
          ></template>
        </v-tooltip>
        <v-tooltip text="Suspend Order">
          <template v-slot:activator="{ props }">
            <v-btn
              color="white"
              variant="tonal"
              density="compact"
              icon="mdi-cancel"
              v-bind="props"
            ></v-btn
          ></template>
        </v-tooltip>
        <v-tooltip text="Delete Order">
          <template v-slot:activator="{ props }">
            <v-btn
              color="white"
              variant="tonal"
              density="compact"
              icon="mdi-delete"
              v-bind="props"
            ></v-btn
          ></template>
        </v-tooltip>

        <v-menu :open-on-hover="true">
          <template v-slot:activator="{ props }">
            <v-btn
              density="compact"
              color="transparent"
              variant="flat"
              icon
              v-bind="props"
              ><v-icon>mdi-menu</v-icon></v-btn
            >
          </template>
          <v-list density="compact" color="primary" color="pink">
            <v-list-item
              value="deleteAll"
              active-class="purple"
              color="primary"
              prepend-icon="mdi-delete-sweep"
            >
              <v-list-item-title>Delete All</v-list-item-title>
            </v-list-item>
            <v-list-item prepend-icon="mdi-folder-cancel" value="suspendAll">
              <v-list-item-title>Suspend All</v-list-item-title>
            </v-list-item>
            <v-list-item @click.prevent.stop value="reduceOrder">
              <v-list-item-title>Reduce Order</v-list-item-title>
              <v-list-item-action class="d-flex align-center">
                <v-text-field
                  density="compact"
                  variant="solo"
                  single-line
                  label="QTY"
                  hide-details="auto"
                  placeholder="2"
                  type="number"
                ></v-text-field>
                <v-btn density="compact" variant="text" icon="mdi-sync"></v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-list-item prepend-icon="mdi-pencil" value="changePrice">
              <v-list-item-title>Change Price</v-list-item-title>
            </v-list-item>
            <v-list-item prepend-icon="mdi-pencil-circle-outline" value="editSuspended">
              <v-list-item-title>Edit suspended order</v-list-item-title>
            </v-list-item>
            <v-list-item prepend-icon="mdi-send-circle-outline" value="editSuspended">
              <v-list-item-title>Re-submit suspended order</v-list-item-title>
            </v-list-item>
            <v-list-item
              prepend-icon="mdi-table-headers-eye"
              @click="state.openHeaderPicker = true"
              value="tableHeaders"
            >
              <v-list-item-title>Open Table Headers</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col> -->
</template>
<script setup lang="ts">
import { Ref } from "vue";
import { ActionButton } from "@/models/UI";
import CloseComponentButton from "@/components/CloseComponentButton.vue";
import DynamicToolbarActionsHandler from "./DynamicToolbarActions.vue";



const props = defineProps({
  class: String,
  dataLength: Number,
  socketState: String,
  actionButtons: {
    type: Array<ActionButton>,
    required: true,
  },
  tooltip: String,
  title: String,
  closeComponent: {
    type: Function,
    required: true,
  },
});
</script>
