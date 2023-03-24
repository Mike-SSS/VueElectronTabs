import Futures from "@/views/TradingView/Futures.vue";
import Options from "@/views/TradingView/Options.vue";
import Placeholder from "@/views/TradingView/Placeholder.vue";
import MarketDisplayData from "@/views/Overview/MarketDisplayData.vue";

export type ComponentRegistry = {
  Futures: typeof Futures;
  Options: typeof Options;
  Placeholder: typeof Placeholder;
  MarketDisplayData: typeof MarketDisplayData;
  // Add more components as needed
};

const componentRegistry: ComponentRegistry = {
    Futures,
    Options,
    MarketDisplayData,
    Placeholder
  // ...register more components as needed
};

export default componentRegistry;
