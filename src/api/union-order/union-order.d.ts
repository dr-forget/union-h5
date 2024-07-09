interface H5UniOrderList {
  page: number;
  limit: number;
  list: H5UniOrderListRow[];
}

interface H5UniOrderListRow {
  wx_id: string;
  rebate_money: number;
  rebate_platform: string;
  platform_order_id: string;
  title: string;
  image: string;
  order_time: string;
  platform_order_status: number;
  order_status: number;
  order_status_desc: string;
  order_amount: number;
  fail_reason: string;
  order_update_time: string;
  price_compare_status: number;
  platform_share_fee: string;
  super_wx_id: string;
  createdAt: string;
  updatedAt: string;
  super_commission_money?: number;
  is_self: boolean;
  rights_protection_status: number;
}
