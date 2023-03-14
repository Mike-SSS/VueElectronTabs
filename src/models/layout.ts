import { VueElement } from "vue";

export interface COLUMN {
  // width: number;
  grid: {
    "grid-column": string; //"1 / span 4"
    "grid-row": string; //"1 / span 4";
  };
  color: string;
  content: string;
  // height: number;
  id: string;
  component: string | typeof VueElement | null;
}
type DIRECTION = "left" | "right" | "up" | "down";
export interface LAYOUT {
  name: string;
  columns: COLUMN[];
}
