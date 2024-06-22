<template>
  <view class="coupon-box flex items-center" :style="{ background: props.background }">
    <view class="coupon-left">
      <slot name="left"></slot>
    </view>
    <view class="coupon-right">
      <slot name="right"></slot>
    </view>
    <view class="line"></view>
  </view>
</template>
<script setup lang="ts">
interface Isprops {
  background?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Isprops>(), {
  background: 'rgba(249, 123, 145, 0.15)',
  disabled: false,
});
</script>
<style lang="scss" scoped>
.coupon-box {
  width: 100%;
  border-radius: 12rpx;
  position: relative;
  color: $uni-color-primary;
  overflow: hidden;
  padding: 30rpx 0;

  .coupon-left {
    width: 160rpx;
    text-align: center;
    font-size: 18px;
  }

  .coupon-right {
    padding: 16px 12px;
    display: flex;
    flex: 1;
    flex-direction: column;
    position: relative;
  }
}

.line {
  position: absolute;
  top: 20rpx;
  left: 170rpx;
  border: 1px dashed #fa505a;
  bottom: 20rpx;
}

.coupon-box::before {
  content: '';
  position: absolute;
  left: 160rpx;
  height: 24rpx;
  width: 24rpx;
  top: -12rpx;
  border-radius: 50%;
  background: #fff;
}

.coupon-box::after {
  content: '';
  position: absolute;
  left: 160rpx;
  height: 24rpx;
  width: 24rpx;
  bottom: -12rpx;
  border-radius: 50%;
  background: #fff;
}
</style>
