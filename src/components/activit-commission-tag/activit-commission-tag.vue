<template>
  <view v-if="![ProxyLevelEnum.VERMICELLI].includes(useUserData.userinfo.proxy_level || ProxyLevelEnum.VERMICELLI)" class="flex f-26 f-middle relative">
    <view class="origin-price flex items-center" :class="active_class.origin_class">
      <image v-if="!props.is_subsidy" :src="active_class.icon" class="mr-4" style="width: 28rpx; height: 28rpx" />
      <text :class="{ 't-through': props.is_subsidy }" class="f-28">￥{{ $formatMoney(props.origin_commise) }}</text>
    </view>
    <view class="commise relative flex items-center" :class="active_class.actvie_class">
      <image :src="active_class.line_image" mode="heightFix" class="line-image" />
      <image v-if="props.is_subsidy" src="https://storage.szline9.com/frontend/static/svg/commise-high.svg" style="width: 28rpx; height: 28rpx" />
      <text :class="{ 't-through': !props.is_subsidy }">￥{{ $formatMoney(props.commise_price) }}</text>
    </view>
  </view>
</template>
<script setup lang="ts">
import { IsNewAgent } from '@/enum/proxy';
import { ProxyLevelEnum } from '@/enum/proxy';
import { computed } from 'vue';
import useStore from '@/store';

const { useUserData } = useStore();

interface Isprops {
  origin_commise: number | string;
  commise_price: number | string;
  is_subsidy?: boolean; //是否有高佣权限
}

const props = withDefaults(defineProps<Isprops>(), {
  origin_commise: 0,
  commise_price: 0,
  is_subsidy: false,
});

const active_class = computed(() => {
  const commClass = {
    origin_class: 'origin-proxy-price',
    actvie_class: 'proxy-color',
    icon: 'https://storage.szline9.com/frontend/static/svg/commise-tag.svg',
    line_image: 'https://storage.szline9.com/frontend/static/public/proxy-line.jpeg',
  };
  const event_class = {
    [ProxyLevelEnum.RESERVE_AGENT]: {
      origin_class: 'origin-price',
      actvie_class: 'proxy-color',
      icon: 'https://storage.szline9.com/frontend/static/svg/proxy-agent.svg',
      line_image: 'https://storage.szline9.com/frontend/static/public/new-proxy-line.jpeg',
    },
    [ProxyLevelEnum.PROXY_LEVEL_PRIMARY]: {
      origin_class: 'origin-proxy-price',
      actvie_class: 'proxy-color',
      icon: 'https://storage.szline9.com/frontend/static/svg/commise-tag.svg',
      line_image: 'https://storage.szline9.com/frontend/static/public/proxy-line.jpeg',
    },
    // [ProxyLevelEnum.PROMOTION_AMBASSADOR_VIP]: {
    //   origin_class: 'origin-proxyvip-price',
    //   actvie_class: 'proxy-color',
    //   icon: 'https://storage.szline9.com/frontend/static/svg/proxy-vip.svg',
    //   line_image: 'https://storage.szline9.com/frontend/static/public/proxy-vip-line.jpeg',
    // },
  };
  // 新代理
  if (useUserData.userinfo.new_proxy == IsNewAgent.NEW_AGENT && useUserData.userinfo.proxy_level == ProxyLevelEnum.PROXY_LEVEL_PRIMARY) {
    return {
      origin_class: 'origin-price',
      actvie_class: 'proxy-color',
      icon: 'https://storage.szline9.com/frontend/static/svg/agent-commise.svg',
      line_image: 'https://storage.szline9.com/frontend/static/public/new-proxy-line.jpeg',
    };
  }
  const data = event_class[useUserData.userinfo.proxy_level || ProxyLevelEnum.VERMICELLI] || commClass;
  return data;
});
</script>
<style lang="scss" scoped>
.origin-price {
  border-radius: 20rpx 0 0 20rpx;
  padding: 2rpx 18rpx 2rpx 12rpx;
  color: #fff;
  position: relative;
}

.origin-proxy-price {
  background: #ffa141 !important;
  color: #fff !important;
}

.origin-proxyvip-price {
  background: #333 !important;
  color: #ffded0 !important;
}

.origin-price {
  background: #ffcb3b;
  color: #8f4e49;
}

.proxy-color {
  background: #ff6236;
  color: #fff;
}

.line-image {
  height: 100%;
  width: 40rpx;
  /* border: 1px solid red; */
  position: absolute;
  left: -10rpx;
}

.commise {
  color: #fff;
  padding: 2rpx 12rpx 2rpx 24rpx;
  border-radius: 0 20rpx 20rpx 0;
  box-sizing: border-box;
}
</style>
