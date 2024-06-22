<template>
  <view v-if="![ProxyLevelEnum.VERMICELLI].includes(useUserData.userinfo.proxy_level || ProxyLevelEnum.VERMICELLI)" class="tag-bg flex items-center" :class="commisse_tag_class?.class">
    <text v-if="props.is_estimated || props.prefix" class="f-20 mr-8 mt-2">{{ props.is_estimated ? '预估' : props.prefix }}</text>
    <view v-if="!props.prefix" class="flex items-center">
      <image :src="commisse_tag_class.icon" style="width: 28rpx; height: 28rpx"></image>
    </view>
    <text class="f-middle f-28 ml-4">￥{{ $formatMoney(props.is_subsidy ? props.price : +props.price - props.high_commission) }}</text>
  </view>
</template>
<script setup lang="ts">
import useStore from '@/store';

import { ProxyLevelEnum, IsNewAgent } from '@/enum/proxy';
import { computed } from 'vue';
interface Isprops {
  price: string | number;
  high_commission?: number;
  is_subsidy?: boolean; //是否有高佣权限
  is_estimated?: boolean; //是否预估
  prefix?: string; // 自定义前缀
}

const props = withDefaults(defineProps<Isprops>(), {
  price: 0,
  high_commission: 0,
  is_subsidy: false,
  is_estimated: false,
  prefix: '',
});

const { useUserData } = useStore();

const commisse_tag_class = computed(() => {
  const commonClass = {
    class: '',
    icon: 'https://storage.szline9.com/frontend/static/svg/commise-tag.svg',
  };
  const classObj = {
    [ProxyLevelEnum.RESERVE_AGENT]: {
      class: 'reserver-agent',
      icon: 'https://storage.szline9.com/frontend/static/svg/proxy-agent.svg',
    },
    [ProxyLevelEnum.PROXY_LEVEL_PRIMARY]: {
      class: 'reserver-agent',
      icon: 'https://storage.szline9.com/frontend/static/svg/agent-commise.svg',
    },
    // [ProxyLevelEnum.PROMOTION_AMBASSADOR_VIP]: {
    //   class: 'proxy-vip',
    //   icon: 'https://storage.szline9.com/frontend/static/svg/proxy-vip.svg',
    // },
  };

  // 高佣
  if (props.high_commission && props.is_subsidy) {
    return {
      class: 'high-commise-bg',
      icon: 'https://storage.szline9.com/frontend/static/svg/commise-high.svg',
    };
  }
  // 老代理
  if (useUserData.userinfo.new_proxy == IsNewAgent.OLD_AGENT && useUserData.userinfo.proxy_level == ProxyLevelEnum.PROXY_LEVEL_PRIMARY) {
    return commonClass;
  }

  return classObj[useUserData.userinfo.proxy_level || ProxyLevelEnum.VERMICELLI] || commonClass;
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

.proxy-vip {
  background: #333;
  color: #ffded0;
}

.reserver-agent {
  background: #ffcb3b;
  color: #722722;
}

.high-commise-bg {
  background: #ff6236 !important;
  color: #fff;
}
</style>
