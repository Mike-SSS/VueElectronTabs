import { Ref } from "vue";
import { LAYOUT } from "./layout";

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
export interface IUserFlags {
  insertOrderOrDouble: boolean;
  cancelAllActiveOrders: boolean;
  suspendAllActiveOrders: boolean;
  deleteActiveOrder: boolean;
  suspendActiveOrder: boolean;
  reduceActiveOrder: boolean;
  resubmitActiveOrder: boolean;
  editSuspendOrder: boolean;
  insertUnmatchedDeal: boolean;
  deleteUnmatchedDeal: boolean;
  acceptUnmatchedDeal: boolean;
  editUnmatchedDeal: boolean;
  splitDeal: boolean;
  assignDealToMember: boolean;
  tripartiteDeal: boolean;
  cumulateDeal: boolean;
  correctDealPrinciple: boolean;
  exerciseOption: boolean;
  abandonOption: boolean;
  subAccountChange: boolean;
  deleteSiloCertAuctionBid: boolean;
}
export interface IUserDefaults {
  price: string;
}
export interface IUserProfileDefaults {
  branch: string;
  dealer: string;
  client: string;
}
export interface IUserPref {
  flags: IUserFlags;
  profile: IUserProfileDefaults;
  defaults: IUserDefaults;
}

export interface UserPreferences {
  _id?: number;
  userId: string;
  userPreferenceJson: string | IUserPref;
}
export interface UserLayout {
  id?: number;
  userId: string;
  userLayoutJson: string | LAYOUT;
}
