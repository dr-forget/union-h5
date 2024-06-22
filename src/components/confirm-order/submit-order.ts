import useStore from '@/store';
import lineHook from '@/hooks/uni-hook';
import wechatPay from '@/hooks/wechat-pay';
import { ErrSn } from '@/api/enum';
import { PayPageOpen, ShopSource, ChangeProxySource } from '@/enum/comm';
import { submitOrderMore } from '@/api/order';

interface ReturnResonseData {
  code: number;
  data: SkuType[];
  payresult?: boolean;
  orders?: OrderPayinfo[];
  pay_order_sn?: string;
}

export default function useSubmitOrder() {
  const { wePayment } = wechatPay();

  const { useShopBags, useUserData } = useStore();

  const { Toast, router } = lineHook();

  const deleteCartsku = (indices: number[]) => {
    // 从后往前排序索引
    indices.sort((a, b) => b - a);
    for (let index of indices) {
      useShopBags.cart_skus.splice(index, 1);
    }
  };

  const submitPay = async (sku?: Partial<SkuType>): Promise<ReturnResonseData> => {
    const skuInfo = sku || {};
    if (!useShopBags.addressinfo.id) {
      Toast('请添加地址后，才可下单哦~');
      return {
        code: 2,
        data: [],
      };
    }
    // 如果存在未消费的上级ID 先消费一波
    if (useUserData.proxyCode) {
      await useUserData.userChangeProxy(useUserData.proxyCode + '' || '', ChangeProxySource.CONFIRM_ORDER);
    }
    // 兼容指定sku下单
    const source = skuInfo.id ? skuInfo.source : useShopBags.cart_skus[0].source;
    let goods_list: any[] = [];
    if (skuInfo.id) {
      goods_list.push({ number: 1, goods_sku_id: skuInfo.id, remake: skuInfo.remark || useShopBags.remark });
    } else {
      goods_list = useShopBags.cart_skus.map((item) => ({ number: item.select_stock, goods_sku_id: item.id, remark: item.remark || useShopBags.remark }));
    }

    const params = {
      address_id: useShopBags.addressinfo?.id || 0,
      goods_list: goods_list,
      proxy_id: 0,
      remark: useShopBags.remark,
      ticket: useUserData.ticket || '',
      is_share: useUserData.collectPageOpenType || 0,
      activity_id: useUserData.activity_id || 0,
      real_name_id: source == ShopSource.SEA_AMOY_GOODS ? useShopBags.realInfo.id || 0 : 0,
    };

    const result = await submitOrderMore(params);
    // 提交完订单 重置下活动ID
    useUserData.activity_id = 0;
    useUserData.collectPageOpenType = 0;
    // 没有错误信息 直接发起支付
    if (!result.has_error) {
      const payresult = await wePayment({ pay_id: result.pay_order_id, is_subscribe: true });
      // 提交成功后清空购物袋
      return { code: 0, data: [], payresult, orders: result.orders, pay_order_sn: result.pay_order_sn };
    }
    // 库存不足的错误消息
    const nostockError = result.errors.filter((item) => item.err_sn == ErrSn.StockNotEnough);
    if (nostockError.length) {
      // 根据库存不足的skuid 反查购物袋中的sku
      const deleteSkuList: number[] = []; //记录需要移除的sku
      const nostockinfo = nostockError.map((item) => {
        const skuCartIndex = useShopBags.cart_skus.findIndex((sku) => sku.id == item.err_data.goods_sku_id);
        const skuinfo = { ...useShopBags.cart_skus[skuCartIndex], stock: item.err_data.current_stock };
        if (item.err_data.current_stock == 0) {
          deleteSkuList.push(skuCartIndex);
        } else {
          useShopBags.cart_skus[skuCartIndex].select_stock = item.err_data.current_stock;
        }
        return skuinfo;
      });
      deleteCartsku(deleteSkuList);
      return { code: 1, data: nostockinfo };
    } else {
      Toast(result.errors[0].err_msg);
      // 错误消息
      return { code: 2, data: [] };
    }
  };
  return { submitPay };
}
