import Futures from "@/views/TradingView/Futures.vue";
import Options from "@/views/TradingView/Options.vue";
import MarketDisplayData from "@/views/Overview/MarketDisplayData.vue";

export type ComponentRegistry = {
  Futures: typeof Futures;
  Options: typeof Options;
  MarketDisplayData: typeof MarketDisplayData;
  // Add more components as needed
};

const componentRegistry: ComponentRegistry = {
    Futures,
    Options,
    MarketDisplayData
  // ...register more components as needed
};

export default componentRegistry;
