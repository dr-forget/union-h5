/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<
    {
      $u: any;
      $t: (key: string) => string;
      $copy: (data: any) => void;
      $ossCdnImage: (url: string, w: number, suffix?: boolean) => string;
      $formatMoney: (number: number | string, decimal?: number, split?: string) => string;
      $strStarding: (str: string, start: number, end?: number) => string;
    },
    {},
    any
  >;

  export default component;
}

interface TabsType {
  name: string;
  key?: string;
  badge?: any;
  value: any;
  auth?: any[];
  icon?: string;
}

declare interface Uni {
  $u: any;
  $t: (key: string) => string;
  $copy: (data: any) => void;
  $ossCdnImage: (url: string, w: number, suffix?: boolean) => string;
  $formatMoney: (number: number | string, decimal?: number, split?: string) => string;
  $loki_report: (data: any, level?: 'info' | 'error') => void;
  getUniReportConfig: () => any;
  uniReportsetConfig: (config: any) => void;
  $strStarding: (str: string, start: number, end?: number) => string;
  $sleep: (timer: number, cb?: () => void) => Promise<any>;
}

declare module 'uview-plus';
