import { VueElement } from "vue";
import { ComponentRegistry } from "@/models/componentRegistry";

interface Grid {
  "grid-column": string;
  "grid-row": string;
}

export interface COLUMN {
  // width: number;
  grid: Grid;
  color: string;
  content: string;
  // height: number;
  props?: Record<string, any>;
  id: string;
  component: keyof ComponentRegistry | null;
}
type DIRECTION = "left" | "right" | "up" | "down";
export interface LAYOUT {
  name: string;
  columns: COLUMN[];
}
