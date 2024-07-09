<template>
  <view class="pb-12">
    <view v-for="(item, i) in state.orderData" :key="i" class="p-24 radius-12 bg-white mb-20">
      <header-top :shopname="platform_name(item.rebate_platform)" :logo="platfromIcon[item.rebate_platform || ''] || 'https://storage.szline9.com/frontend/static/public/%E8%B7%AF%E5%BE%84.png'">
        <template #rightTop>
          <view v-if="item.is_self" class="f-26" :class="item.order_status == 3 ? 'c-999' : 'c-primary'">{{ commise_status(item.order_status) }}</view>
          <view class="f-26" :class="item.order_status == 3 ? 'c-999' : 'c-primary'" v-else>好友下单</view>
        </template>
      </header-top>
      <union-order
        :shop-title="item.title"
        :imgurl="item.image"
        :disabled="item.order_status == OrderStatusEnum.INVALID"
        :shop-price="item.order_amount"
        :commise="item.super_commission_money || 0"
        :is_self="item.is_self"
        :status="item.order_status"
        :user_money="item.rebate_money"
        :rights_protection_status="item.rights_protection_status"
      >
        <template #price>
          <view class="mr-30" :class="item.order_status == 3 ? 'c-999' : 'c-333'">实付:￥{{ $formatMoney(item.order_amount || '') }}</view>
        </template>
        <template #bottom>
          <view class="mt-20">
            <u-line></u-line>
            <view class="mt-20 f-24" :class="item.order_status == 3 ? 'c-999' : 'c-333'">
              <view class="flex flex-between items-center">
                <view>
                  <view v-if="item.price_compare_status == 1" class="f-24 flex items-center c-primary" @click.stop="state.showtips = true">
                    <text>比价订单，无分佣返利（暂不支持结算）</text>
                    <view class="mt-4">
                      <u-icon name="question-circle" size="24rpx" color="#F62349"></u-icon>
                    </view>
                  </view>
                  <view v-if="item.rights_protection_status && item.rights_protection_status !== 3" class="c-primary mb-12">
                    {{ item.rights_protection_status == 2 ? '维权成功佣金已重新分配' : '订单维权中佣金已锁定' }}
                  </view>
                  <view class="mt-6 f-24">
                    <text>订单状态：{{ item.order_status_desc }}</text>
                  </view>
                  <view class="mt-12">
                    <text>付款时间：{{ item.order_time }}</text>
                  </view>
                  <view class="mt-12">
                    <text>订单编号：{{ item.platform_order_id }}</text>
                    <text class="c-666 ml-12" @click.stop="$copy(item.platform_order_id)">复制</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </template>
      </union-order>
    </view>
    <load-more v-if="(!state.nodata || state.loadingStatus == 'loading') && state.orderData.length > 2" :status="state.loadingStatus"></load-more>
    <view class="safe-area-inset-bottom"></view>
    <u-transition :show="state.nodata && state.loadingStatus !== 'loading'">
      <u-empty margin-top="200rpx" icon="https://font-css.oss-cn-hangzhou.aliyuncs.com/image/applet/empty/order.png" text="暂无订单"></u-empty>
    </u-transition>
    <u-modal :show="state.showtips" content_padding="30rpx" confirm-text="我知道了" @confirm="state.showtips = false">
      <view>
        <view class="t-center f-36 mb-30 f-middle mt-24">已被联盟平台判定为比价订单</view>
        <view class="f-28 c-333">
          <view>因拼多多规则限制,查券人浏览过此商品,1小时内通过返利链接下单即会认为比价订单。</view>
          <view class="mt-12">目前有2种解决方案:</view>
          <view class="mt-6">方案一:不切换账号,查完返俐等1小时后再下単,中途不要浏览此商品</view>
          <view class="mt-6">方案二:切换账号下单(切换后请确保看不到原账号订单)</view>
        </view>
      </view>
    </u-modal>
  </view>
</template>

<script setup lang="ts">
import useHookData, { OrdersettleStatus } from './hook';
import lineHook from '@/hooks/uni-hook';
import dayjs from 'dayjs';
import headerTop from '@/components/order-card/header.vue';
import { watch } from 'vue';
import { PLATFORMSENUM, OrderStatusEnum } from '@/enums/plat_form';

interface Isprops {
  searchKey?: string;
  platform: string;
  status?: number;
  type?: number;
}

const props = withDefaults(defineProps<Isprops>(), {
  start_time: '',
  end_time: '',
  searchKey: '',
  platform: '',
  status: 0,
  type: 0,
});

const commise_status = (value) => {
  const status_map = new Map([
    [1, '待结算'],
    [2, '已结算'],
    [3, '已失效'],
    [4, '待结算'],
  ]);
  return status_map.get(value);
};

const platform_name = (val) => {
  const status_map = new Map([
    [PLATFORMSENUM.TAO_BAO, '淘宝'],
    [PLATFORMSENUM.PIN_DUO_DUO, '拼多多'],
    [PLATFORMSENUM.JD, '京东'],
    [PLATFORMSENUM.KUAI_SHOU, '快手'],
  ]);
  return status_map.get(val);
};

const platfromIcon = {
  [PLATFORMSENUM.TAO_BAO]: 'https://storage.szline9.com/frontend/static/public/%E7%9F%A9%E5%BD%A2%206356.png',
  [PLATFORMSENUM.PIN_DUO_DUO]: 'https://storage.szline9.com/frontend/static/public/%E7%9F%A9%E5%BD%A2%206357.png',
  // [PLATFORMSENUM.chuanshanjia]: 'https://storage.szline9.com/frontend/static/public/%E7%9F%A9%E5%BD%A2%206358.png',
  [PLATFORMSENUM.JD]: 'https://storage.szline9.com/frontend/static/public/%E7%9F%A9%E5%BD%A2%206359%20%281%29.png',
  [PLATFORMSENUM.KUAI_SHOU]: 'https://storage.szline9.com/frontend/static/public/image%402x.png',
  // [AlliancePlatform.vip]: 'https://storage.szline9.com/frontend/static/public/%E7%9F%A9%E5%BD%A2%206360%402x.png',
};

const { state, setData, onLoadData } = useHookData<Isprops>(props);

const { router, showModal } = lineHook();

const Loadmore = async () => {
  if (['loading', 'nomore'].includes(state.loadingStatus)) {
    return;
  }
  setData({ page: state.page + 1 });
  onLoadData(state.page);
};

defineExpose({
  onLoadData,
  Loadmore,
});

watch([() => props.platform, () => props.status], ([platform, status]) => {
  console.log(status, 140);
  setData({
    platform,
    status,
  });
});
</script>

<style scoped lang="scss">
.show {
  max-height: 200rpx;
  transition: 0.2s all;
}
.hidden {
  max-height: 0;
  overflow: hidden;
  transition: 0.2s all;
}
.deg {
  transform: rotate(0);
  transition: 0.2s;
}
.rotate {
  transform: rotate(180deg);
  transition: 0.2s;
}
</style>
