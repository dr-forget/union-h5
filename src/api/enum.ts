export enum ResponseCode {
  'SUCCESS' = 77001,
  'ERROR' = 77002,
}

/**
 * 错误编码
 */
export enum ErrSn {
  AddressNotBelongToCurrentUser = 'address_not_belong_to_current_user',
  AddressNotExists = 'address_not_exists',
  AddressNotInArea = 'address_not_in_area',
  AddressParseError = 'address_parse_error',
  ChannelNotExists = 'channel_not_exists',
  Exception = 'exception',
  GoodsListEmpty = 'goods_list_empty',
  GoodsNotExists = 'goods_not_exists',
  GoodsNotSale = 'goods_not_sale',
  GoodsSkuNotExists = 'goods_sku_not_exists',
  PayOrderCreatedFail = 'pay_order_created_fail',
  ProxyNotExists = 'proxy_not_exists',
  RealNameNotEqAddressName = 'real_name_not_eq_address_name',
  RealNameNotExists = 'real_name_not_exists',
  StockNotEnough = 'stock_not_enough',
}
