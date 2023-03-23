// Utilities
import { LAYOUT } from "@/models/layout";
import { defineStore } from "pinia";


interface State {
  layout: LAYOUT | null;
  layoutOptions: LAYOUT[];
}

export const useLayoutStore = defineStore("layout", {
  state: (): State => ({
    //
    layout: null,
    layoutOptions: [      
      {
        name: "Layout 3",
        columns: [
          {
            grid: {
              "grid-column": "1 / span 12",
              "grid-row": "1 / span 6",
            },
            color: "primary",
            content: "Column 1",
            component: "Futures",
            id: "first",
          },
          {
            grid: {
              "grid-column": "1 / span 4",
              "grid-row": "7 / span 6",
            },
            color: "purple",
            content: "Column 2",
            component: null,
            id: "second1",
          },
          {
            grid: {
              "grid-column": "5 / span 4",
              "grid-row": "7 / span 6",
            },
            color: "yellow",
            content: "Column 2-2",
            component: null,
            id: "second",
          },
          {
            grid: {
              "grid-column": "9 / span 4",
              "grid-row": "7 / span 6",
            },
            color: "error",
            content: "Column 6",
            component: null,
            id: "sixth",
          },
        ],
      },
      {
        name: "Layout 5",
        columns: [
          {
            grid: {
              "grid-column": "1 / span 6",
              "grid-row": "1 / span 6",
            },
            color: "primary",
            content: "Column 1",
            component: "Futures", // futures
            id: "first",
          },
          {
            grid: {
              "grid-column": "1 / span 6",
              "grid-row": "7 / span 6",
            },
            color: "secondary",
            content: "Column 2",
            component: "Futures", // options
            id: "third",
            props: {
              initialValue: 5,
            },
          },
          {
            grid: {
              "grid-column": "7 / span 6",
              "grid-row": "1 / span 6",
            },
            color: "warning",
            content: "Column 3",
            component: "MarketDisplayData",
            id: "second",
          },
          {
            grid: {
              "grid-column": "7 / span 6",
              "grid-row": "7 / span 6",
            },
            color: "success",
            content: "Column 4",
            component: "Futures",
            id: "forth",
          },
        ],
      },
      {
        name: "Layout 4",
        columns: [
          {
            grid: {
              "grid-column": "1 / span 8",
              "grid-row": "1 / span 6",
            },
            color: "primary",
            content: "Column 1",
            component: "Futures",
            id: "first",
          },
          {
            grid: {
              "grid-column": "1 / span 8",
              "grid-row": "7 / span 6",
            },
            color: "secondary",
            content: "Column 2",
            component: "Options",
            props: {
              initialValue: 10,
            },
            id: "second",
          },
          {
            grid: {
              "grid-column": "9 / span 4",
              "grid-row": "1 / span 3",
            },
            color: "warning",
            content: "Column 3",
            component: null,
            id: "third",
          },
          {
            grid: {
              "grid-column": "9 / span 4",
              "grid-row": "4 / span 3",
            },
            color: "success",
            content: "Column 4",
            component: null,
            id: "forth",
          },
          {
            grid: {
              "grid-column": "9 / span 4",
              "grid-row": "7 / span 3",
            },
            color: "secondary",
            content: "Column 5",
            component: null,
            id: "fifth",
          },
          {
            grid: {
              "grid-column": "9 / span 4",
              "grid-row": "10 / span 3",
            },
            color: "error",
            content: "Column 6",
            component: null,
            id: "sixth",
          },
        ],
      },
      {
        name: "Layout 7",
        columns: [
          {
            grid: {
              "grid-column": "1 / span 4",
              "grid-row": "1 / span 6",
            },
            color: "primary",
            content: "Column 1",
            component: null,
            id: "first",
          },
          {
            grid: {
              "grid-column": "5 / span 4",
              "grid-row": "1 / span 6",
            },
            color: "accent",
            content: "Column 1-2",
            component: null,
            id: "first1",
          },
          {
            grid: {
              "grid-column": "1 / span 4",
              "grid-row": "7 / span 6",
            },
            color: "purple",
            content: "Column 2",
            component: null,
            id: "second1",
          },
          {
            grid: {
              "grid-column": "5 / span 4",
              "grid-row": "7 / span 6",
            },
            color: "yellow",
            content: "Column 2-2",
            component: null,
            id: "second",
          },
          {
            grid: {
              "grid-column": "9 / span 4",
              "grid-row": "1 / span 3",
            },
            color: "warning",
            content: "Column 3",
            component: null,
            id: "third",
          },
          {
            grid: {
              "grid-column": "9 / span 4",
              "grid-row": "4 / span 6",
            },
            color: "success",
            content: "Column 4",
            component: null,
            id: "forth",
          },
          {
            grid: {
              "grid-column": "9 / span 4",
              "grid-row": "10 / span 3",
            },
            color: "error",
            content: "Column 6",
            component: null,
            id: "sixth",
          },
        ],
      },
      {
        name: "Layout 6",
        columns: [
          {
            grid: {
              "grid-column": "1 / span 4",
              "grid-row": "1 / span 6",
            },
            color: "primary",
            content: "Column 1",
            component: null,
            id: "first",
          },
          {
            grid: {
              "grid-column": "5 / span 4",
              "grid-row": "1 / span 6",
            },
            color: "accent",
            content: "Column 1-2",
            component: null,
            id: "first1",
          },
          {
            grid: {
              "grid-column": "1 / span 4",
              "grid-row": "7 / span 6",
            },
            color: "purple",
            content: "Column 2",
            component: null,
            id: "second1",
          },
          {
            grid: {
              "grid-column": "5 / span 4",
              "grid-row": "7 / span 6",
            },
            color: "yellow",
            content: "Column 2-2",
            component: null,
            id: "second",
          },
          {
            grid: {
              "grid-column": "9 / span 4",
              "grid-row": "1 / span 3",
            },
            color: "warning",
            content: "Column 3",
            component: null,
            id: "third",
          },
          {
            grid: {
              "grid-column": "9 / span 4",
              "grid-row": "4 / span 3",
            },
            color: "success",
            content: "Column 4",
            component: null,
            id: "forth",
          },
          {
            grid: {
              "grid-column": "9 / span 4",
              "grid-row": "7 / span 3",
            },
            color: "secondary",
            content: "Column 5",
            component: null,
            id: "fifth",
          },
          {
            grid: {
              "grid-column": "9 / span 4",
              "grid-row": "10 / span 3",
            },
            color: "error",
            content: "Column 6",
            component: null,
            id: "sixth",
          },
        ],
      },
    ],
  }),
  actions: {
    setCurrentLayout(layout: LAYOUT) {
      this.layout = layout;
    },
    setLayoutOptions(layouts: LAYOUT[]) {
      this.layoutOptions = layouts;
    },
    changeColumnComponent(comp: any, colId: string) {
      // only works for selectedLayout else add layoutId: string
      const found = this.currentLayout?.columns.find((e) => e.id == colId);
      if (found) {
        // found
        found.component = comp;
      }
    },
  },

  getters: {
    currentLayout: (state) => state.layout,
  },
});
