type LoadingStatus = 'loading' | 'nomore' | 'loadmore';
type RUNENVTYPE = 'dev' | 'test' | 'prod';
type $t = (key: string) => string;
interface TabsType {
  name: string;
  key?: string;
  badge?: any;
  value: any;
  auth?: any[];
  icon?: string;
}
interface CustomTabItem {
  name: string; //名称
  value: any;// value
  key:string; //后端字段
  height?: number; //高度 //图片高度有效
  href?: string; //是否调整路径
  programIcon?: string; //左侧icon小图标
  tagImage?: string; //tabItem 标签图片
  activeImage?: string; // tabItem 选中图片
  sort_options?: {   // 排序选项 上下箭头
    value: any;
    [key: string]: any;
  }[];
  [key: string]: any;
}
