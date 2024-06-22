<template>
  <view :class="props.type == 'default' ? 'collection-box py-4' : 'costom-type-box pb-8'">
    <view v-if="props.type !== 'default'" class="c-fff flex items-center flex-between mx-16 title" @click="toInfo()">
      <view class="flex items-center">
        <line-icon name="nine9-hot f-36"></line-icon>
        <image src="https://storage.szline9.com/frontend/static/svg/today-icon.svg" style="width: 148rpx; height: 52rpx" />
      </view>
      <view class="flex items-center f-30">
        <text>更多</text>
        <view class="mt-4">
          <u-icon name="arrow-right" color="#fff" size="26rpx"></u-icon>
        </view>
      </view>
    </view>
    <view class="bg-white px-22 radius-16 collect-content" :class="props.type == 'default' ? 'mx-4' : 'mx-8'" :style="{ height: props.type == 'default' ? '576rpx' : '504rpx' }" @click="toInfo()">
      <view v-if="props.type == 'default'" class="c-primary flex pt-22 mb-24">
        <view style="max-width: 260rpx" class="u-line-1 f-30">{{ props.title }}</view>
        <u-icon name="arrow-right" color="#fb395c"></u-icon>
      </view>
      <view class="pt-24">
        <view v-for="(item, i) in props.shop_list" :key="i" @click.stop="toInfo(item.id)">
          <view class="flex items-center" :class="{ 'mt-28': i !== 0 }">
            <image :src="$ossCdnImage(item.main_image, 130)" mode="aspectFill" class="radius-12 flex-shrink" lazy-load />
            <view class="ml-20 f-28">
              <view class="u-line-1">{{ item.title }}</view>
              <view class="c-primary mt-10 f-32 f-middle">￥{{ $formatMoney(item.price) }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import lineHook from '@/hooks/uni-hook';
import useStore from '@/store';
import { ProxyLevelEnum } from '@/enum/proxy';
import { computed } from 'vue';

interface Isprops {
  title: string;
  id: string | number;
  shop_list: any[];
  showtype?: string;
  category_id?: number[];
  type: string;
}

const { useUserData } = useStore();

const emit = defineEmits(['click']);

const props = withDefaults(defineProps<Isprops>(), {
  title: '',
  id: 0,
  shop_list: () => [],
  showtype: 'collect',
  category_id: () => [],
  type: 'default',
});

const { router } = lineHook();

const toInfo = (skuid?: number) => {
  if (props.showtype == 'category') {
    const category_id = props.category_id?.[0] || 0;
    emit('click', { id: category_id, skuid });
    return;
  }
  if (props.id == 'todayopen') {
    router.to('/pages/opening-today/opening-today');
    return;
  }
  router.to(`/pages/shop/product-collection/product-collection?resource_id=${props.id}&skuid=${skuid || ''}`);
};
</script>
<style lang="scss" scoped>
.costom-type-box {
  /* border: 1px solid red; */
  width: 344rpx;
  background: $uni-color-primary;
  border-radius: 20rpx;
  .title {
    height: 70rpx;
    /* border: 1px solid blue; */
  }
}

.collection-box {
  /* 合集外阴影 */
  width: 344rpx;
  box-sizing: border-box;
  font-weight: 500;
  box-shadow: 0px 0px 16rpx 0px rgba(246, 35, 73, 0.5);
  border-radius: 20rpx;
  background-image: linear-gradient(98deg, #fb395c 10%, #f59953 93%);

  /* height: 530rpx; */
}
.collect-content {
  /* height: 542rpx; */
  /* height: 482rpx; */

  image {
    width: 130rpx;
    height: 130rpx;
  }
}
</style>
