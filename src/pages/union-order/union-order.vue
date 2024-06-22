<template>
  <view>
    <view class="bg-white order-tab px-24">
      <u-tabs
        :list="state.platforms"
        :current="state.current"
        :active-style="{ color: '#F62349' }"
        lineColor="#F62349"
        :scrollable="false"
        :item-style="{ height: '44px', fontSize: '30rpx' }"
        @change="tabsChange"
      ></u-tabs>
      <view style="margin-top: -4rpx">
        <u-line></u-line>
      </view>
      <view class="px-24">
        <u-tabs
          :list="state.commission_status"
          :current="state.status_current"
          :active-style="{ color: '#F62349' }"
          lineHeight="0"
          :scrollable="false"
          :item-style="{ height: '40px', fontSize: '28rpx' }"
          @change="statusChange"
        ></u-tabs>
      </view>
    </view>
    <view>
      <view class="c-primary f-24 mb-20 ml-20 mt-24"> 受第三方平台限制，仅作展示，相关操作请移步至对应平台 </view>
      <view class="mx-24">
        <union-page ref="pageRef" :status="state.commission_status[state.status_current].value" :platform="state.platforms[state.current].value"></union-page>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import lineHook from '@/hooks/uni-hook';
import useHookData from './hook';
import { onLoad, onReady, onReachBottom } from '@dcloudio/uni-app';
import { ref, nextTick } from 'vue';
import unionPage from './union-page/union-page.vue';
// const { router } = lineHook

const pageRef = ref<any>(null);

const { state, setData, onGetOrderList } = useHookData();

const onRequestData = async () => {
  try {
    uni.showLoading({ title: '载入中...' });
    await pageRef.value?.onLoadData();
  } finally {
    uni.hideLoading();
  }
};

const tabsChange = (item) => {
  if (state.current == item.index) return;
  state.current = item.index;
  nextTick(onRequestData);
  uni.pageScrollTo({ scrollTop: 0, duration: 200 });
};

const statusChange = (item) => {
  if (state.status_current == item.index) return;
  state.status_current = item.index;
  nextTick(onRequestData);
};

onReachBottom(() => {
  pageRef.value?.Loadmore();
});

onReady(() => {
  onRequestData();
});
</script>
<style lang="scss" scoped>
.order-tab {
  position: sticky;
  position: -webkit-sticky;
  left: 0;
  top: 0;
  z-index: 99;
}
</style>
