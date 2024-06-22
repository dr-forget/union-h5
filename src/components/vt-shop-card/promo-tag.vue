<template>
  <view class="promo-tag" :class="{ 'promon-tag-plain': props.plain }" :style="tagStyle">
    <slot></slot>
  </view>
</template>
<script setup lang="ts">
import { computed } from 'vue';
interface Isprops {
  background?: string;
  color?: string;
  bordercolor?: string;
  plain?: boolean; // 朴素按钮
}

const props = withDefaults(defineProps<Isprops>(), {
  background: 'rgba(249, 123, 145, 0.15)',
  color: '#F62349',
  bordercolor: '#FF9FB0',
  plain: false,
});

const tagStyle = computed(() => {
  const obj = {
    background: props.background,
    color: props.color,
    'border-color': props.bordercolor,
  };
  return obj;
});
</script>

<style lang="scss" scoped>
.promo-tag {
  // color: $uni-color-primary;
  // background: rgba(249, 123, 145, 0.15);
  display: inline-block;
  padding: 0px 12rpx;
  font-size: 26rpx;
  border-radius: 8rpx;
  font-weight: 500;
  flex-shrink: 0;
  border-width: 0.8px;
  border-style: solid;
  border-color: transparent;
  box-sizing: border-box;
  height: 36rpx;
  display: flex;
  align-items: center;
  justify-items: center;
}
.promon-tag-plain {
  background: transparent !important;
  border: none;
  padding: 0 !important;
}
</style>
