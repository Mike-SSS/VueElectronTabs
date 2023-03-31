import Futures from "@/views/TradingView/Futures.vue";
import Deltas from "@/views/TradingView/Deltas.vue";
import Options from "@/views/TradingView/Options.vue";
import Splits from "@/views/TradingView/Splits.vue";
import Spreads from "@/views/TradingView/Spreads.vue";
import Placeholder from "@/views/TradingView/Placeholder.vue";
import MarketDisplayData from "@/views/Overview/MarketDisplayData.vue";

export type ComponentRegistry = {
  Futures: typeof Futures;
  Options: typeof Options;
  Deltas: typeof Deltas;
  Spreads: typeof Spreads;
  Splits: typeof Splits;
  Placeholder: typeof Placeholder;
  MarketDisplayData: typeof MarketDisplayData;
  // Add more components as needed
};

const componentRegistry: ComponentRegistry = {
    Futures,
    Splits,
    Options,
    Spreads,
    Deltas,
    MarketDisplayData,
    Placeholder
  // ...register more components as needed
};

export default componentRegistry;
