<template>
  <view>
    <view class="safe-height"></view>
    <root-portal>
      <view class="footer safe-area-inset-bottom bg-white flex flex-center items-center" :style="{ zIndex: props.zIndex }">
        <slot></slot>
      </view>
    </root-portal>
  </view>
</template>
<script setup lang="ts">
interface Isprops {
  isshowDown?: boolean; //是否需要阴影
  zIndex?: number; //z-index
}
const props = withDefaults(defineProps<Isprops>(), {
  isshowDown: true,
  zIndex: 990,
});
</script>
