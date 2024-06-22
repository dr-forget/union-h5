export {};
declare module 'vue' {
  interface ComponentCustomProperties {
    $u: any;
    $t: (key: string) => string;
    $copy: (data: any) => void;
    $ossCdnImage: (url: string, w: number, suffix?: boolean) => string;
    $formatMoney: (number: number | string, decimal?: number, split?: string) => string;
    $strStarding: (str: string, start: number, end?: number) => string;
  }
}
