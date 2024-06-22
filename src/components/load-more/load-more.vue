<template>
  <u-loadmore :status="loadmoreStatus" :loadmore-text="props.isShowText ? '上拉加载更多' : ''" :nomore-text="props.isShowText ? '到底啦~我也是有底线的' : ''">
    <template v-if="status == 'nomore'" #icon="{ status }">
      <image v-if="props.isShowText" src="https://storage.szline9.com/frontend/static/svg/nodata.svg" style="width: 40rpx; height: 40rpx" />
    </template>
  </u-loadmore>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
interface Isprops {
  status: LoadingStatus;
  isShowText?: boolean;
}
const props = withDefaults(defineProps<Isprops>(), {
  status: 'loading',
  isShowText: true,
});
const loadmoreStatus = ref<LoadingStatus>(props.status);
watch(
  () => props.status,
  (val) => {
    loadmoreStatus.value = val;
  }
);
</script>
<style lang="scss" scoped></style>
