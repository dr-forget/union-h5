<template>
  <view>
    <image src="/static/wechat-msg.jpg" mode="widthFix" class="wx-code" />
  </view>
</template>
<script setup lang="ts">
import lineHook from '@/hooks/uni-hook';
import useHookData from './hook';
import { onLoad } from '@dcloudio/uni-app';
// const { router } = lineHook
// const {state,setData}=useHookData()
onLoad((option) => {});
</script>
<style lang="scss" scoped>
.wx-code {
  width: 100%;
}
</style>
<style>
page {
  background: #fff;
}
</style>
