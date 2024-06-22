<template>
  <view>
    <view class="flex items-center flex-between mb-24">
      <view v-if="slots.leftTop">
        <slot name="leftTop"></slot>
      </view>
      <view v-else class="flex items-center">
        <u-image :src="props.logo" width="36rpx" height="36rpx" />
        <view class="f-26 c-333 ml-6">{{ props.shopname }}</view>
        <view class="ml-24 f-26">
          <slot name="nameRight"></slot>
        </view>
        <view v-if="isarrow" class="ml-6">
          <u-icon name="arrow-right" size="28rpx"></u-icon>
        </view>
      </view>
      <view class="f-28 flex-shrink">
        <slot name="rightTop"></slot>
      </view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import { useSlots, ref } from 'vue';
interface Isprops {
  logo?: string;
  shopname?: string; ///店铺名称
  isarrow?: boolean;
}
const props = withDefaults(defineProps<Isprops>(), {
  shopname: '九号线自营旗舰店', ///店铺名称
  isarrow: false,
  logo: 'https://jiu-shop-static.oss-cn-shenzhen.aliyuncs.com/newStatic/shoplogo.png',
});
const slots = ref(useSlots());
</script>
