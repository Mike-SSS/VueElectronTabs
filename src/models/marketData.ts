export enum PublishAll {
  ActiveOrders = 1,
  Instruments = 2,
  Holidays = 3,
  ContractDate = 4,
  Positions = 5,
}
export type FilterCondition = {
  field: string;
  operator: "==" | "!==" | ">" | "<" | ">=" | "<=";
  value: any;
};
interface ContractDisplay {
  instrument: string;
  contractDate: string;
  strike: number;
  flag: string;
  contracT_TYPE: number;
  contractDisplay: string;
}

export interface MarketDisplayItemContract {
  [key: string]: string | number | ContractDisplay;
  displaySeq: string;
  contract: string;
  contractDisplay: ContractDisplay;
  qtyBid: string;
  bid: string;
  offer: string;
  qtyOffer: string;
  change: string;
  time: string;
  last: string;
  hi: string;
  lo: string;
  volume: string;
  openPrice: string;
  contractSeq: string;
  dateSeq: string;
  strikeSeq: string;
  secondContractSeq: string;
  secondDateSeq: string;
}

export interface MarketDisplayItemInstrument {
  instrumentSeq: number;
  instrumentType: number;
  instrumentGroup: number;
  futureFee: number;
  optionFee: number;
  deliveryFee: number;
  marketNumber: number;
  instrumentName: string;
  class: number;
  isIn: string;
  description: string;
  onScreen: boolean;
  issueDate: Date;
  underlying: number;
  optionExerciseIsPercentage: boolean;
  optionExerciseCost: number;
  groupMargin: number;
  vat: boolean;
  settlementMargin: number;
  physicallSettlement: boolean;
  groupDescription: string;
}
export interface MarketDisplayItemPosition {
  positionSeq: number;
  clearingMember: string;
  member: string;
  dealer: string;
  principal: string;
  contract: string;
  open: number;
  bought: number;
  sold: number;
  close: number;
  uncommitedBuy: number;
  uncommitedSell: number;
  uncommitedPosition: number;
  openNetUncommited: number;
  openTotalPosition: number;
  openConsideration: number;
  netUncommited: number;
  totalPosition: number;
  consideration: number;
  physicalPosition: number;
  physicalDeliveries: number;
  date: Date;
}
export interface MarketDisplayItemContractDate {
  instrumentSeq: number;
  contractDateSeq: number;
  expiryDate: Date;
  expiryMonths: number;
  valuationDate: Date;
  nominal: number;
  strikeInterval: number;
  strikeIntervalOffScreen: number;
  spreadMargin: number;
  lotSize: number;
  optionLotSize: number;
  bigDepth: number;
  priceRate: string;
  maxChange: number;
  maxDaysMove: number;
  maxGap: string;
  optionsAllowed: boolean;
  deltasAllowed: boolean;
  spreadsAllowed: boolean;
  initialMargin: number;
  quoteFormat: string;
  priceFormat: string;
  clearanceDate: Date;
  vsr: number;
  rpve: number;
  minReportOnlyVol: number;
  priceInterval: number;
  allOrNothingAllowed: boolean;
  atBestOrdersAllowed: boolean;
  stopOrdersAllowed: boolean;
  iceBergOrdersAllowed: boolean;
  holdOverOrdersAllowed: boolean;
  atCloseOrdersAllowed: boolean;
  futuresAnon: boolean;
  optionsAnon: boolean;
  siloCertAuctAnon: boolean;
  siloCertAuctBidInterval: number;
  optionExpiry: Date;
}

export interface MarketDisplayItemActiveOrder {
  activeOrderSeq: number;
  enterTime: number;
  userCode: string;
  userDealer: string;
  clearingMember: string;
  member: string;
  dealer: string;
  principal: string;
  buySell: string;
  orderState: string;
  quantity: number;
  contract: string;
  rate: number;
  referenceCode: string;
  suffixCode: number;
  profitCentre: string;
  subAccount: string;
  originalQuantity: number;
  principleAgency: string;
  gash: string;
}

export interface MarketDisplayItemHoliday {
  holidaySeq: string;
  centreCode: string;
  date: Date;
}
// export type FilterCondition = {
//   field: string;
//   value: any;
//   nested?: boolean;
// };



interface OrderBase {
  userDealer: string;
  clearingMember: string;
  member: string;
  dealer: string;
  principal: string;
  buySell: string;
  contract: string;
  rate: number;
  suffixCode: number;
  profitCentre: string;
  subAccount: string;
  principleAgency: string;
}

interface ActiveOrderBase {
  activeOrderSeq: number;
  enterTime: TimeSpan;
  userCode: string;
  orderState: string;
  quantity: number;
  referenceCode: string;
  originalQuantity: number;
  gash: string;
}

interface CompletedOrderBase {
  completedOrderSeq: number;
  enterTime: TimeSpan;
  userMember: string;
  state: string;
  qty: number;
  userRef: string;
  origQty: number;
  dealtRate: number;
  dealtPrice: number;
  exchangeRef: string;
  tradeDate: Date;
  tradeTime: TimeSpan;
  matchDate: Date;
  matchTime: TimeSpan;
  counterParty: string;
  price: number;
  origin: string;
  reason: string;
  spotPrice: number;
  hitter: boolean;
}

export type ActiveOrder = OrderBase & ActiveOrderBase;

export type CompletedOrder = OrderBase & CompletedOrderBase;

interface TimeSpan {
  days: number;
  hours: number;
  milliseconds: number;
  minutes: number;
  seconds: number;
  ticks: number;
  totalDays: number;
  totalHours: number;
  totalMilliseconds: number;
  totalMinutes: number;
  totalSeconds: number;
}

// export interface ActiveOrder {
//   activeOrderSeq: number;
//   enterTime: TimeSpan;
//   userCode: string;
//   userDealer: string;
//   clearingMember: string;
//   member: string;
//   dealer: string;
//   principal: string;
//   buySell: string;
//   orderState: string;
//   quantity: number;
//   contract: string;
//   rate: number;
//   referenceCode: string;
//   suffixCode: number;
//   profitCentre: string;
//   subAccount: string;
//   originalQuantity: number;
//   principleAgency: string;
//   gash: string;
// }

// interface TimeSpan {
//   days: number;
//   hours: number;
//   milliseconds: number;
//   minutes: number;
//   seconds: number;
//   ticks: number;
//   totalDays: number;
//   totalHours: number;
//   totalMilliseconds: number;
//   totalMinutes: number;
//   totalSeconds: number;
// }

// export interface CompletedOrder {
//   completedOrderSeq: number;
//   enterTime: TimeSpan;
//   userMember: string;
//   userDealer: string;
//   clearingMember: string;
//   member: string;
//   dealer: string;
//   principal: string;
//   buySell: string;
//   state: string;
//   qty: number;
//   contract: string;
//   rate: number;
//   userRef: string;
//   suffixCode: number;
//   profitCentre: string;
//   subAccount: string;
//   origQty: number;
//   dealtRate: number;
//   dealtPrice: number;
//   exchangeRef: string;
//   tradeDate: Date;
//   tradeTime: TimeSpan;
//   matchDate: Date;
//   matchTime: TimeSpan;
//   counterParty: string;
//   price: number;
//   origin: string;
//   reason: string;
//   principleAgency: string;
//   spotPrice: number;
//   hitter: boolean;
// }
