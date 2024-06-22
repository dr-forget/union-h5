<template>
  <view class="tag-bg flex items-center" :class="commisse_tag_class?.class">
    <view class="flex items-center">
      <image :src="commisse_tag_class.icon" style="width: 28rpx; height: 28rpx"></image>
    </view>
    <text class="f-middle f-28 ml-4">￥{{ $formatMoney(props.price) }}</text>
  </view>
</template>
<script setup lang="ts">
import { computed } from 'vue';
interface Isprops {
  price: string | number;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Isprops>(), {
  price: 0,
  disabled: false,
});

const commisse_tag_class = computed(() => {
  const commonClass = {
    class: '',
    icon: 'https://storage.szline9.com/frontend/static/svg/commise-tag.svg',
  };
  if (props.disabled) {
    return {
      class: 'disabled-commise',
      icon: 'https://storage.szline9.com/frontend/static/svg/disabled-commise.svg',
    };
  }

  return commonClass;
});
</script>
<style lang="scss" scoped>
.tag-bg {
  background: #ffa141;
  color: #fff;
  padding: 2rpx 16rpx;
  color: #fff;
  font-size: 24rpx;
  border-radius: 20rpx;
}

.disabled-commise {
  background: #cbcbcb;
  color: #fff;
}
</style>
