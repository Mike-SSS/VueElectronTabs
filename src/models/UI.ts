import { Ref } from "vue";

export interface ActionButton {
  id: string;
  tooltip: string;
  color: string;
  variant: VariantButton;
  disabled?: boolean;
  density: string;
  icon: string;
  textField: TextField | null; // this is null if there's no text field
  action: () => void;
}
export type VariantButton = NonNullable<
  "flat" | "text" | "elevated" | "tonal" | "outlined" | "plain"
>;
export type VariantTextField =
  | "filled"
  | "outlined"
  | "plain"
  | "underlined"
  | "solo"
  | "solo-inverted"
  | "solo-filled";

export type Density = null | "default" | "comfortable" | "compact";
export interface TextField {
  density: Density;
  variant: VariantTextField;
  singleLine: boolean;
  label: string;
  hideDetails: boolean | "auto" | undefined;
  placeholder: string;
  type: string;
}
