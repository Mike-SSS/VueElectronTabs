import { UserLayout, UserPreferences } from "./UI";

export enum MitsOrderType {
  // Normal order.
  Normal = 0,
  // Take or Kill.
  Tok = 1,
  // Fill or Kill.
  Fok = 2,
  // Iceberg.
  Iceberg = 4,
  // Stop order.
  Stop = 8,
  // At best.
  AtBest = 16,
  // All or nothing.
  AllOrNothing = 32,
  // At close.
  AtClose = 128,
}
export enum Capacity {
  PrincipalCapacity = "P",
  AgencyCapacity = "A",
}
export enum State {
  Active = "A",
  Suspended = "S",
  Waiting = "W",
}
export enum BuySell {
  Buy = "B",
  Sell = "S",
}
export enum MsgType {
  OrderMan = 0,
  OrderData = 1,
  OrderDataResetRequest = 2,
  ErrorCallBack = 4,
}
export interface IMessage {
  msgType: MsgType;
}
export interface IInsertOrderFutures {
  contractName: string;
  // buyOrSell: BuySell;
  buyOrSell: boolean;
  dealerCode: string;
  memeberCode: string;
  value: number;
  qty: number;
  principal: string;
  orderType: MitsOrderType;
  timeout_secs: number;
  principalAgency: boolean;
  userRef: string;
}
export enum InstructionType {
  Reset = 0,
  Insert = 1,
  Update = 2,
  Delete = 3,
}
interface IOrderMessage extends IMessage {
  instructionType: InstructionType;
  orderId?: number;
  time: string; // HH:mm:ss (24h format)
  member: string;
  dealer: string;
  principal: string;
  buySell: BuySell;
  state: State;
  qty: number;
  contract: string;
  price: number;
  userRef: string;
  subAccount: string;
  capacity: Capacity;
}

export interface IClientCodeDealer {
  clientCodes: string[];
  dealerCode: string;
}

export interface IClientCode {
  branch: string;
  codesPerDealer: IClientCodeDealer[];
}
export interface IMasterDealerCodes {
  branch: string;
  clientCodes: string[];
  dealers: string[];
}

export interface IUser {
  _id: number;
  userId: string;
  uniqueCode: string;
  setup: "Dealer" | "Retail Client";
  safexCodes: null | string[]; // or another appropriate type instead of null if applicable
  client: string[];
  branch: string[];
  dealer: string[];
  clientCodes: IClientCode[] | null;
  tradingSystem: string;
  defaultCode: string;
  username: string;
  masterDealerCodes: null | IMasterDealerCodes[];
  masterdealer: boolean;
  admin: boolean;
  viewOnly: boolean;
  onScreenLimit: number;
  optionLimit: number;
  reportOnlyLimit: number;
  createdBy: string;
  createdDate: string; // or Date if you will parse the date
  updatedBy: string;
  updatedDate: string; // or Date if you will parse the date
}
