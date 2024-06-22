<template>
  <view class="flex content-box" @click="emit('click')">
    <view class="image-box relative">
      <u-image :src="$ossCdnImage(props.imgurl, 180)" mode="aspectFill" width="164rpx" height="164rpx" :radius="8"></u-image>
    </view>
    <view class="content flex flex-between pl-20">
      <view>
        <view class="f-26 u-line-2 c-333">{{ props.shopTitle }}</view>
        <view v-if="props.shopspec" class="f-28 c-333 mt-8">
          <text>规格属性 </text>
        </view>
      </view>
      <view class="flex items-center flex-between w-full f-26">
        <slot name="price">
          <view class="mr-30">实付:￥{{ $formatMoney(props.shopPrice) }}</view>
        </slot>
        <view class="f-24">
          <view v-if="!props.is_self">
            <text style="color: #ff6236" class="f-middle">
              <text>分佣</text>
              <text class="f-28">￥{{ $formatMoney(props.commise) }}</text>
            </text>
          </view>
          <view class="flex flex-1" v-else>
            <view class="flex flex-between items-center">
              <text style="color: #ff6236" class="f-middle">
                <text>返利</text>
                <text class="f-28">￥{{ $formatMoney(props.user_money) }}</text>
              </text>
              <text class="c-666 ml-8">{{ commise_status(props.status) }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
  <view class="bottom">
    <slot name="bottom"></slot>
  </view>
</template>
<script lang="ts" setup>
import lineHook from '@/hooks/uni-hook';

interface Isprops {
  imgurl: string; ///商品图片
  shopTitle: string; ///商品标题
  shopPrice?: string | number;
  commise?: string | number;
  disabled?: boolean;
  is_self: boolean;
  status: number;
  user_money: string | number;
}
const props = withDefaults(defineProps<Isprops>(), {
  imgurl: '', ///商品图片
  shopTitle: '', ///商品标题
  shopPrice: '',
  shopspec: '',
  commise: 0,
  disabled: false,
  is_self: false,
  status: 1,
  proxy_settle_at: 0,
  user_settle_at: 0,
  user_money: 0,
  user_id: 0,
});

const emit = defineEmits(['click']);

const { showModal } = lineHook();

const commise_status = (value) => {
  const status_map = new Map([
    [1, '冻结中'],
    [2, '已结算'],
    [3, '已失效'],
    [4, '待结算'],
  ]);
  return status_map.get(value);
};

const showbindTips = () => {
  showModal({
    title: '',
    content: '自己下单：请在wx中发送“我要提现”给自己点开提现页绑定。\n 好友下单：请好友在wx中发送“我要提现”给您，并让好友点击提现页绑定。',
    confirmText: '我知道了',
  });
};
</script>
<style lang="scss" scoped>
.content-box {
  box-sizing: border-box;
  .content {
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
  }
}

.tag {
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(180deg, #f62349 0%, #fd3748 100%);
  color: #fff;
  border-radius: 12rpx 0 12rpx 0;
  padding: 2rpx 12rpx;
}
</style>
