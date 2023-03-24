/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<
    {
      VITE_DEV_SERVER_URL: string;
    },
    {},
    any
  >;
  export default component;
}
