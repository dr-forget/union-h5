import useStore from '@/store';
import lineHook from '@/hooks/uni-hook';
import { wechatPayment } from '@/api/order';
interface Isprops {
  is_subscribe?: boolean;
  is_zero_pay?: boolean;
  pay_id: string | number;
  isLoading?: boolean;
}
export default function wechatPay() {
  const { useUserData } = useStore();
  const { Toast } = lineHook();
  const wePayment = (props: Isprops): Promise<boolean> => {
    return new Promise(async (reslove) => {
      try {
        // #ifdef MP-WEIXIN
        if (useUserData.mini_notice && props.is_subscribe) {
          try {
            const res = await uni.requestSubscribeMessage({
              tmplIds: ['uK57wAcJ_7yVAm7gqkGL4DP6LNUffL-U_Lt8JDfbKzc', 'oh6Pg0vwe0rSZ2_t_yOFlj8Eq5JM2rr6SYN_-lRkxBk'],
            });
          } catch (err) {
            console.log(err, 20);
          }
        }
        // #endif
        props.isLoading && uni.showLoading({ title: '载入中' });
        const wechatcode: any = await uni.login({});
        const res = await wechatPayment({ code: wechatcode?.code, pay_id: props.pay_id, type: 'wechat' });
        props.isLoading && uni.hideLoading();
        // #ifdef MP-WEIXIN
        if (!props.is_zero_pay) {
          //@ts-ignore uni-app 支付 ts类型不全  禁用检查
          await uni.requestPayment({
            nonceStr: res.nonceStr,
            package: res.package,
            paySign: res.paySign,
            signType: 'MD5',
            timeStamp: res.timeStamp,
          });
        }
        reslove(true);
        // #endif
      } catch (err) {
        console.log(err, 32);
        Toast('支付失败');
        reslove(false);
      }
    });
  };
  return { wePayment };
}
