<template>
  <view class="shop-card-box hidden bg-white pb-20 radius-16 relative" :style="{ height: props.shop_postion ? '580rpx' : '546rpx' }" @click="cardClick">
    <view class="img-box relative">
      <image mode="aspectFill" :style="{ height: ishow_commiseTag ? '344rpx' : '400rpx' }" :src="$ossCdnImage(props.image, 344)" lazy-load></image>
      <!-- 售罄 -->
      <!--  -->
      <view v-if="stock === 0" class="img-mask flex items-center flex-center">
        <image class="sell-out" src="https://jiu-shop-static.oss-cn-shenzhen.aliyuncs.com/uploads/20230503/fecdd91cce1a798ae9c162b51e8e01b2.png"> </image>
      </view>
      <slot name="imageContent"></slot>
    </view>

    <view class="pl-18 pr-18 mt-8">
      <view class="f-30 c-333" :class="`u-line-${props.title_show_line}`">
        <view v-if="props.source == ShopSource.SEA_AMOY_GOODS" class="shop-tag mr-8">海淘 </view>
        <text> {{ props.title?.substring(0, props.source == ShopSource.SEA_AMOY_GOODS ? 7 : 10) }}</text>
      </view>
      <view v-if="props.shop_postion" class="hidden w-full flex mt-6" style="flex-wrap: nowrap">
        <promo-tag v-for="(item, i) in tag_list" :key="i" class="mr-6 flex-shrink" :color="!props.tag_list.length ? '#BC671B' : '#F62349'" :plain="!props.tag_list.length">{{ item }}</promo-tag>
      </view>
      <view class="flex" :class="{ 'mt-12': ishow_commiseTag }">
        <slot name="commission">
          <!-- 高佣tag -->
          <active-commission-tag
            v-if="props.subsidy_commission > 0"
            :is_subsidy="props.is_subsidy"
            :origin_commise="+props.commission - props.subsidy_commission"
            :commise_price="props.commission"
          ></active-commission-tag>
          <!-- 普通佣金tag -->
          <commission-tag v-else :price="props.commission" :is_estimated="props.is_estimated"></commission-tag>
        </slot>
      </view>
      <view class="price-box mt-22 flex flex-between items-center">
        <view>
          <text class="f-32 c-primary f-bold">￥</text>
          <text class="c-price f-bold f-40"> {{ $formatMoney(props.price) }}</text>
          <text v-if="props.marketPrice" class="ml-18 c-gray t-through f-24">￥{{ $formatMoney(props.marketPrice) }}</text>
        </view>

        <text v-if="props.showSale" class="c-gray f-24 mt-10">已抢{{ props.sales }}件</text>
        <slot v-else name="priceRight"> </slot>
      </view>
    </view>
    <view v-if="leftTag" class="hot-tag flex items-center">
      <text class="ml-6 f-24 f-middle">{{ leftTag }}</text>
    </view>
  </view>
</template>
<script lang="ts" setup>
import commissionTag from '../commission-tag/commission-tag.vue';
import activeCommissionTag from '../activit-commission-tag/activit-commission-tag.vue';
import promoTag from './promo-tag.vue';
import useStore from '@/store';
import dayjs from 'dayjs';
import { ShopSource, GoodsLocation } from '@/enum/comm';
import { computed, watch } from 'vue';
import { ProxyLevelEnum } from '@/enum/proxy';

interface Isprops {
  image: string;
  title: string;
  price: string | number;
  marketPrice?: string | number;
  sales?: number;
  stock: number;
  commission: number | string;
  showSale?: boolean;
  subsidy_commission?: number; //高佣补贴
  source?: number;
  begin_time?: number;
  title_show_line?: number;
  is_subsidy?: boolean; //是否有高佣权限
  shop_postion?: number; //商品定位
  is_estimated?: boolean; //是否预估
  tag_list?: string[];
}

const { useUserData } = useStore();

const props = withDefaults(defineProps<Isprops>(), {
  image: '',
  title: '',
  price: '',
  marketPrice: '',
  sales: 0,
  stock: 0,
  subsidy_commission: 0,
  showSale: true,
  source: 1,
  begin_time: 0,
  title_show_line: 2,
  is_subsidy: false,
  shop_postion: 0, //爱库存没有定位 通过此字段判断是否是爱库存区域
  is_estimated: false,
  tag_list: () => [],
});

const emit = defineEmits(['click']);
const ishow_commiseTag = computed(() => {
  return ![ProxyLevelEnum.VERMICELLI].includes(useUserData.userinfo.proxy_level || ProxyLevelEnum.VERMICELLI);
});

const tag_list = computed(() => {
  if (!props.shop_postion) return [];
  if (props.tag_list.length) {
    return props.tag_list.slice(0, 2);
  }
  const obj = {
    [GoodsLocation.DRAINAGE_GOODS]: ['限时秒杀'],
    [GoodsLocation.DAILY_SALES_GOODS]: ['回头客99%', '好评率99%', '今日热卖'],
    [GoodsLocation.EXPLOSIVE_GOODS]: ['即将恢复原价', '即将售罄', '限时折扣', '今日特惠'],
    [GoodsLocation.WAIST_GOODS]: ['即将恢复原价', '即将售罄', '限时折扣', '今日特惠'],
  };
  const value = obj[props.shop_postion];
  const random = Math.floor(Math.random() * value.length) + 1;
  return [value[random - 1]];
});

const leftTag = computed(() => {
  const currt_timer = dayjs().unix();
  const diff = dayjs(currt_timer * 1000).diff(dayjs(props.begin_time * 1000), 'hour');
  if ([ShopSource.MAINLAND_STRAIGHT_HAIR, ShopSource.INLAND_TRANSHIPMENT, ShopSource.SEA_AMOY_GOODS].includes(props.source) && diff > 24) {
    return '即将下架';
  }
  if (currt_timer < props.begin_time) {
    const diff = dayjs(props.begin_time * 1000).diff(dayjs(currt_timer * 1000), 'day');
    if (diff > 0) {
      return dayjs(props.begin_time * 1000).format('MM月DD日 HH:mm') + '开团';
    }
    return dayjs(props.begin_time * 1000).format('HH:mm') + '开团';
  }
  return '';
});

const cardClick = () => {
  emit('click');
};
</script>
<style lang="scss" scoped>
.shop-card-box {
  width: 344rpx;
  height: 580rpx;
  box-sizing: border-box;
}

.hot-tag {
  position: absolute;
  top: 0;
  left: 0;
  background: $u-primary;
  color: #fff;
  font-size: 22rpx;
  border-radius: 16rpx 0 16rpx 0;
  padding: 6rpx 12rpx;
}

.img-box {
  image {
    width: 100%;
    border-radius: 12rpx 12rpx 0 0;
    display: block;
  }

  .img-mask {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba($color: #000000, $alpha: 0.4);

    .sell-out {
      width: 180rpx;
      height: 104rpx;
    }
  }
}
</style>
