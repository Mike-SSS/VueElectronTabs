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
      // {
      //   name: "Layout 1",
      //   columns: [
      //     {
      //       width: 7,
      //       height: 2,
      //       color: "primary",
      //       content: "Column 1",
      //       component: null,
      //       id: "first",
      //     },
      //     {
      //       width: 6,
      //       height: 2,
      //       color: "secondary",
      //       content: "Column 2",
      //       component: null,
      //       id: "second",
      //     },
      //     {
      //       width: 12,
      //       height: 4,
      //       color: "error",
      //       content: "Column 3",
      //       component: null,
      //       id: "third",
      //     },
      //     {
      //       width: 6,
      //       height: 6,
      //       color: "success",
      //       content: "Column 4",
      //       component: null,
      //       id: "forth",
      //     },
      //     {
      //       width: 6,
      //       height: 6,
      //       color: "warning",
      //       content: "Column 5",
      //       component: null,
      //       id: "fifth",
      //     },
      //     {
      //       width: 3,
      //       height: 7,
      //       color: "purple",
      //       content: "Column 6",
      //       component: null,
      //       id: "sixth",
      //     },
      //   ],
      // },
      // {
      //   name: "Layout 2",
      //   columns: [
      //     {
      //       width: 8,
      //       height: 6,
      //       color: "primary",
      //       content: "Column 1",
      //       component: null,
      //       id: "first",
      //     },
      //     {
      //       width: 8,
      //       height: 6,
      //       color: "secondary",
      //       content: "Column 2",
      //       component: null,
      //       id: "second",
      //     },
      //     {
      //       width: 4,
      //       height: 12,
      //       color: "error",
      //       content: "Column 3",
      //       component: null,
      //       id: "third",
      //     },
      //   ],
      // },
      {
        name: "Layout 3",
        columns: [
          {
            grid: {
              "grid-column": "1 / span 2",
              "grid-row": "1 / span 1",
            },
            color: "primary",
            content: "Column 1",
            component: null,
            id: "first",
          },
          {
            grid: {
              "grid-column": "1 / span 1",
              "grid-row": "2 / span 2",
            },
            color: "secondary",
            content: "Column 2",
            component: null,
            id: "second",
          },
          {
            grid: {
              "grid-column": "2 / span 1",
              "grid-row": "2 / span 1",
            },
            color: "warning",
            content: "Column 3",
            component: null,
            id: "third",
          },
          {
            grid: {
              "grid-column": "2 / span 1",
              "grid-row": "3 / span 1",
            },
            color: "success",
            content: "Column 4",
            component: null,
            id: "forth",
          },
          {
            grid: {
              "grid-column": "3 / span 1",
              "grid-row": "1 / span 2",
            },
            color: "secondary",
            content: "Column 5",
            component: null,
            id: "fifth",
          },
          {
            grid: {
              "grid-column": "3 / span 1",
              "grid-row": "3 / span 1",
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
            component: null,
            id: "first",
          },
          {
            grid: {
              "grid-column": "1 / span 6",
              "grid-row": "7 / span 6",
            },
            color: "secondary",
            content: "Column 2",
            component: null,
            id: "third",
          },
          {
            grid: {
              "grid-column": "7 / span 6",
              "grid-row": "1 / span 6",
            },
            color: "warning",
            content: "Column 3",
            component: null,
            id: "second",
          },
          {
            grid: {
              "grid-column": "7 / span 6",
              "grid-row": "7 / span 6",
            },
            color: "success",
            content: "Column 4",
            component: null,
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
            component: null,
            id: "first",
          },
          {
            grid: {
              "grid-column": "1 / span 8",
              "grid-row": "7 / span 6",
            },
            color: "secondary",
            content: "Column 2",
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
  },

  getters: {
    currentLayout: (state) => state.layout,
  },
});
