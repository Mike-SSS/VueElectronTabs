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
  defaults:{
    headings: {
      h5: {
        "size": "60px",
      }
    }
  },
  theme: {    
    themes: {
      light: {
        colors: {
          primary: "#316A36",
          secondary: "#5CBBF6",
          background: "#E5E5E5"
        },
      },
    },
  },
});
