<template>
  <view>
    <view v-if="isHeader">
      <header-top :shopname="props.shopname"></header-top>
    </view>
    <view class="flex content-box">
      <view class="image-box">
        <u-image :src="$ossCdnImage(props.imgurl, 170)" width="180rpx" height="180rpx" :radius="8"></u-image>
      </view>
      <view class="content ml-20 flex flex-between">
        <view>
          <view class="f-30 u-line-1 c-333">
            <view v-if="props.source == ShopSource.SEA_AMOY_GOODS" class="shop-tag mr-8">海淘 </view>
            <text> {{ props.shopTitle }}</text>
          </view>
          <view class="f-28 c-707 mt-8 flex items-center" :class="{ 'rule-tag mb-12': props.showRuleTag }" @click="ruleClick">
            <text class="u-line-1"> {{ shopruls }} </text>
            <view v-if="props.showRuleTag" class="ml-6">
              <u-icon name="arrow-right" color="#666" size="28rpx"></u-icon>
            </view>
          </view>
        </view>
        <view v-if="props.commisstyleBlock" class="flex-shrink flex items-center mb-12">
          <commission-tag v-if="props.commise.toString() && isshowcommiseTag" :is_subsidy="props.is_subsidy" :high_commission="props.high_commise" :price="commise"></commission-tag>
        </view>
        <view v-if="props.isshowBottom" class="flex flex-between items-center">
          <view class="flex item-center">
            <view class="mr-24">
              <slot name="price">
                <text class="f-28">￥</text>
                <text class="f-32">{{ $formatMoney(props.shopPrice) }}</text>
              </slot>
            </view>
            <view v-if="!props.commisstyleBlock" class="flex-shrink flex items-center">
              <commission-tag v-if="props.commise.toString() && isshowcommiseTag" :is_subsidy="props.is_subsidy" :high_commission="props.high_commise" :price="commise"></commission-tag>
            </view>
          </view>
          <slot name="number">
            <text class="c-707 f-32">x{{ props.shopnumber }}</text>
          </slot>
        </view>
      </view>
    </view>
    <view>
      <slot name="footer"></slot>
    </view>
    <view class="bottom mt-24">
      <slot name="bottom"></slot>
    </view>
  </view>
</template>
<script lang="ts" setup>
import headerTop from './header.vue';
import commissionTag from '../commission-tag/commission-tag.vue';
import { ShopSource } from '@/enum/comm';
import { computed } from 'vue';
interface Isprops {
  shopname?: string; ///店铺名称
  imgurl: string; ///商品图片
  shopTitle: string; ///商品标题
  shopType: string | Attribute[]; //商品型号
  shopPrice?: string | number;
  commise?: string | number; //商品佣金
  shopnumber?: string | number; //商品数量
  isHeader: boolean;
  isshowBottom?: boolean;
  isshowcommiseTag?: boolean;
  mobile?: string;
  name?: string;
  address?: string;
  high_commise?: number;
  is_subsidy?: boolean; //是否有高佣权限
  source?: number;
  showRuleTag?: boolean;
  commisstyleBlock?: boolean;
}
const props = withDefaults(defineProps<Isprops>(), {
  shopname: '', ///店铺名称
  imgurl: '', ///商品图片
  shopTitle: '', ///商品标题
  shopType: () => [], //商品型号
  shopPrice: '',
  commise: '', //商品佣金
  shopnumber: 1, //商品数量
  isHeader: true,
  isshowBottom: true,
  isshowcommiseTag: true,
  high_commise: 0,
  mobile: '',
  name: '',
  address: '',
  is_subsidy: false,
  source: 0,
  showRuleTag: false,
  commisstyleBlock: false,
});

const emit = defineEmits(['ruleClick']);

const ruleClick = () => {
  if (props.showRuleTag) {
    emit('ruleClick');
  }
};

const shopruls = computed(() => {
  if (!props.shopType) return '';
  if (typeof props.shopType == 'string') return props.shopType;
  return props.shopType.map((item) => item.goods_spec_name || item.spec_name).join(',');
});
</script>
<style lang="scss" scoped>
.content-box {
  .content {
    flex-direction: column;
    width: 100%;
    /* border: 1px solid red; */
    /* width: calc(100% - 204rpx); */
  }

  .rule-tag {
    border-radius: 8rpx;
    padding: 0 6rpx;
    width: fit-content;
    background: #f4f5f6;
  }
}
</style>
