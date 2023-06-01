/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";
import * as labs from "vuetify/labs/components";
import "@/typography.scss";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
    ...labs,
  },
  defaults: {
    VTextField: {
      density: "compact",
      variant: "outlined",
      color: "primary",
    },
    VSelect: {
      density: "compact",
      variant: "outlined",
      color: "primary",
    },
    VAutocomplete: {
      density: "compact",
      variant: "outlined",
      color: "primary",
    },
    VSelectionControl: {
      density: "compact",
      size: 20,
    },
    VCheckboxBtn: {
      density: "compact",
      size: 20,
    },
  },
  theme: {
    themes: {
      light: {
        colors: {
          primary: "#316A36",
          secondary: "#5CBBF6",
          background: "#E5E5E5",
        },
      },
    },
  },
});
