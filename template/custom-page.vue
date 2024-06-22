<template>
  <custom-page title="${name}">
    <view>${name}</view>
  </custom-page>
</template>
<script setup lang="ts">
import lineHook from '@/hooks/uni-hook';
import useHookData from './hook';
import { onLoad } from '@dcloudio/uni-app';
// const { router } = lineHook()
// const {state,setData}=useHookData()
onLoad((option) => {});
</script>
<style lang="scss" scoped></style>
