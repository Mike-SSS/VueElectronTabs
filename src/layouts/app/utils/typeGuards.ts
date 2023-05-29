// typeGuards.ts

import {
  MarketDisplayItemContract,
  MarketDisplayItemInstrument,
  Deal,
  MarketDisplayItemPosition,
  MarketDisplayItemContractDate,
  MarketDisplayItemActiveOrder,
  MarketDisplayItemHoliday,
  ActiveOrder,
  CompletedOrder,
  ContractDisplay
} from "@/models/marketData";

type TypeGuard<T> = (value: any) => value is T;
type Shape<T> = { [K in keyof T]: TypeGuard<T[K]> };

function createTypeGuard<T>(shape: Shape<T>): TypeGuard<T> {
  return (data: any): data is T => {
    for (const key in shape) {
      if (!shape[key](data[key])) {
        return false;
      }
    }
    return true;
  };
}

// Type-checking functions for basic types
const isString: TypeGuard<string> = (value: any): value is string =>
  typeof value === "string";

const isNumber: TypeGuard<number> = (value: any): value is number =>
  typeof value === "number";

const isBoolean: TypeGuard<boolean> = (value: any): value is boolean =>
  typeof value === "boolean";

const isContractDisplay = createTypeGuard<ContractDisplay>({
  instrument: isString,
  contractDate: isString,
  strike: isNumber,
  flag: isString,
  contracT_TYPE: isNumber,
  contractDisplay: isString,
});
const isMarketDisplayItemContract = createTypeGuard<MarketDisplayItemContract>({
  displaySeq: isString,
  contract: isString,
  contractDisplay: isContractDisplay,
  qtyBid: isString,
  bid: isString,
  offer: isString,
  qtyOffer: isString,
  change: isString,
  time: isString,
  last: isString,
  hi: isString,
  lo: isString,
  volume: isString,
  openPrice: isString,
  contractSeq: isString,
  dateSeq: isString,
  strikeSeq: isString,
  secondContractSeq: isString,
  secondDateSeq: isString,
});
export function isMarketDisplayItemInstrument(
  data: any
): data is MarketDisplayItemInstrument {
  // Add your validation logic for MarketDisplayItemInstrument here.
  return true;
}

export function isDeal(data: any): data is Deal {
  // Add your validation logic for Deal here.
  return true;
}

export function isMarketDisplayItemPosition(
  data: any
): data is MarketDisplayItemPosition {
  // Add your validation logic for MarketDisplayItemPosition here.
  return true;
}

export function isMarketDisplayItemContractDate(
  data: any
): data is MarketDisplayItemContractDate {
  // Add your validation logic for MarketDisplayItemContractDate here.
  return true;
}

export function isMarketDisplayItemActiveOrder(
  data: any
): data is MarketDisplayItemActiveOrder {
  // Add your validation logic for MarketDisplayItemActiveOrder here.
  return true;
}

export function isMarketDisplayItemHoliday(
  data: any
): data is MarketDisplayItemHoliday {
  // Add your validation logic for MarketDisplayItemHoliday here.
  return true;
}

export function isActiveOrder(data: any): data is ActiveOrder {
  // Add your validation logic for ActiveOrder here.
  return true;
}

export function isCompletedOrder(data: any): data is CompletedOrder {
  // Add your validation logic for CompletedOrder here.
  return true;
}
