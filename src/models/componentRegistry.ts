import Futures from "@/views/TradingView/Futures.vue";
import Deltas from "@/views/TradingView/Deltas.vue";
import Options from "@/views/TradingView/Options.vue";
import Splits from "@/views/TradingView/Splits.vue";
import Spreads from "@/views/TradingView/Spreads.vue";
import Placeholder from "@/views/TradingView/Placeholder.vue";

import ActiveOrders from "@/views/Orders/ActiveOrders.vue";
import CompletedOrders from "@/views/Orders/CompletedOrders.vue";

import Positions from "@/views/Positions/Positions.vue";
import ConsolidatedPositions from "@/views/Positions/ConsolidatedPositions.vue";

import Deals from "@/views/Deals/Deals.vue";
import UnDeals from "@/views/Positions/Positions.vue";

// import MarketDisplayData from "@/views/Overview/MarketDisplayData.vue";

export type ComponentRegistry = {
  Futures: typeof Futures;
  Options: typeof Options;
  Deltas: typeof Deltas;
  Spreads: typeof Spreads;
  Splits: typeof Splits;
  Placeholder: typeof Placeholder;
  ActiveOrders: typeof ActiveOrders;
  CompletedOrders: typeof CompletedOrders;
  Positions: typeof Positions;
  ConsolidatedPositions: typeof ConsolidatedPositions;
  Deals: typeof Deals;
  // MarketDisplayData: typeof MarketDisplayData;
  // Add more components as needed
};

const componentRegistry: ComponentRegistry = {
    Futures,
    Splits,
    Options,
    Spreads,
    Deltas,
    // MarketDisplayData,
    Placeholder,
    CompletedOrders,
    ActiveOrders,
    Positions,
    ConsolidatedPositions,
    Deals,
  // ...register more components as needed
};

export default componentRegistry;
