<template>
  <view class="shop-card-box flex items-start flex-between py-12 px-12">
    <view class="relative img-box">
      <image :src="$ossCdnImage(props.imageUrl, +props.imgw)" mode="aspectFill" lazy-load class="radius-16 flex-shrink" :style="{ width: props.imgw + 'rpx', height: props.imgh + 'rpx' }" />

      <view v-if="leftTag" class="hot-tag flex items-center">
        <text class="f-24 c-fff">{{ leftTag }}</text>
      </view>
      <view v-if="stock === 0" class="img-mask flex items-center flex-center">
        <image class="sell-out" src="https://jiu-shop-static.oss-cn-shenzhen.aliyuncs.com/uploads/20230503/fecdd91cce1a798ae9c162b51e8e01b2.png"> </image>
      </view>
    </view>
    <view class="w-full ml-24 flex flex-between flex-column" :style="{ height: props.imgh + 'rpx' }">
      <view>
        <view class="mt-12 f-30 c-333 flex">
          <view v-if="props.source == ShopSource.SEA_AMOY_GOODS" class="shop-tag mr-8">海淘 </view>
          <text class="u-line-1">{{ props.title }}</text>
        </view>
        <view class="hidden w-full flex mt-6" style="flex-wrap: nowrap">
          <promo-tag v-for="(item, i) in tag_list" :key="i" class="mr-6 flex-shrink" :color="!props.tag_list.length ? '#BC671B' : '#F62349'" :plain="!props.tag_list.length">{{ item }}</promo-tag>
        </view>
        <view class="flex mt-12">
          <!-- 高佣tag -->
          <active-commission-tag
            v-if="props.subsidy_commission > 0"
            :origin_commise="+props.commission - props.subsidy_commission"
            :commise_price="props.commission"
            :is_subsidy="props.is_subsidy"
          ></active-commission-tag>
          <!-- 普通佣金tag -->
          <commission-tag v-else :price="props.commission"></commission-tag>
        </view>
      </view>
      <view>
        <view v-if="props.showSalesnumber" class="c-999 f-28 ml-12 flex flex-end mb-12">已抢{{ props.sale_total }}件</view>
        <view class="price-box flex flex-between">
          <view class="f-40 f-bold c-price pl-10 price"> ￥{{ $formatMoney(props.price) }} </view>
          <view class="buy-tag flex f-32">
            <image src="https://storage.szline9.com/frontend/static/public/dian2.svg" />

            <view>抢购</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import commissionTag from '../commission-tag/commission-tag.vue';
import activeCommissionTag from '../activit-commission-tag/activit-commission-tag.vue';
import promoTag from '../vt-shop-card/promo-tag.vue';
import useStore from '@/store';
import dayjs from 'dayjs';
import { ShopSource, GoodsLocation } from '@/enum/comm';
import { computed } from 'vue';
interface Isprops {
  imageUrl: string;
  title: string;
  price: number | string;
  original_price?: number | string;
  commission: number | string;
  sale_total: number | string;
  imgw?: string | number;
  imgh?: string | number;
  tagText?: string;
  stock: string | number;
  showSalesnumber?: boolean;
  subsidy_commission?: number; //高佣补贴
  is_subsidy: boolean; //是否有高佣权限
  source: number;
  begin_time: number;
  tag_list?: string[];
  shop_postion?: number | string;
}

const { useUserData } = useStore();

const emit = defineEmits(['buy']);

const props = withDefaults(defineProps<Isprops>(), {
  imageUrl: '',
  title: '',
  price: '',
  original_price: '',
  sale_total: 0,
  commission: 0,
  subsidy_commission: 0,
  imgw: 260,
  imgh: 260,
  tagText: '',
  stock: 99,
  showSalesnumber: true,
  source: 1,
  begin_time: 0,
  shop_postion: 1,
  tag_list: () => [],
});

const tag_list = computed(() => {
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
</script>
<style lang="scss" scoped>
.hot-tag {
  position: absolute;
  left: 0;
  top: 0;
  background: $u-primary;
  border-radius: 16rpx 0 16rpx 0;
  padding: 2rpx 12rpx;
}

.img-box {
  image {
    width: 100%;
    display: block;
  }

  .img-mask {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba($color: #000000, $alpha: 0.4);
    border-radius: 16rpx;

    .sell-out {
      width: 180rpx;
      height: 104rpx;
    }
  }
}

.price-box {
  background: #ffecef;
  border-radius: 12rpx;
  overflow: hidden;

  .price {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
  }

  .buy-tag {
    background: $u-primary;
    color: #fff;
    padding: 10rpx 20rpx 10rpx 30rpx;
    align-items: center;
    flex-shrink: 0;
    /* transform: skew(-25deg, 0); */
    transform-origin: left;
    position: relative;

    image {
      width: 40rpx;
      height: 100%;
      /* height: 40rpx; */
      position: absolute;
      left: -18rpx;
      top: 0rpx;
      z-index: 12;
    }
  }
}

.buy-tag::after {
  content: '';
  position: absolute;
  width: 14rpx;
  height: 100%;
  background: $u-primary;
  top: 0rpx;
  left: 4rpx;
  z-index: 10;
  transform: skew(-25deg);
  transform-origin: right;
}
</style>
