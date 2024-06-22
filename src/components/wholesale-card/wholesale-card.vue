<template>
  <view>
    <view class="flex content-box" @click="emit('click')">
      <view class="image-box relative">
        <u-image :src="$ossCdnImage(props.imgurl, 180)" width="164rpx" height="164rpx" :radius="8"></u-image>
        <view v-if="props.showTag" class="tag f-24">{{ props.tagName }}</view>
      </view>
      <view class="content ml-20 flex flex-between">
        <view>
          <view class="f-30 u-line-1 c-333">{{ props.shopTitle }}</view>
          <slot name="price">
            <view class="f-28 c-333 mt-8">
              <text>￥{{ $formatMoney(shopPrice) }} </text>
            </view>
          </slot>
        </view>
        <view class="flex flex-between items-center w-full">
          <slot name="numberleft">
            <text></text>
          </slot>
          <slot name="number">
            <text class="c-707 f-32">x{{ props.shopnumber }}</text>
          </slot>
        </view>
      </view>
    </view>
    <view class="bottom">
      <slot name="bottom"></slot>
    </view>
  </view>
</template>
<script lang="ts" setup>
interface Isprops {
  imgurl: string; ///商品图片
  shopTitle: string; ///商品标题
  shopPrice?: string | number;
  shopnumber?: string | number; //商品数量
  showTag?: boolean; //是否显示tag
  tagName?: string;
}
const props = withDefaults(defineProps<Isprops>(), {
  imgurl: '', ///商品图片
  shopTitle: '', ///商品标题
  shopPrice: '',
  shopnumber: 1, //商品数量
  showTag: false,
  tagName: '赠品',
});

const emit = defineEmits(['click']);
</script>
<style lang="scss" scoped>
.content-box {
  .content {
    flex-direction: column;
    width: 100%;
  }

  .w-full {
    /* border: 1px solid red; */
    width: 470rpx;
  }
}

.tag {
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(180deg, #f62349 0%, #fd3748 100%);
  color: #fff;
  border-radius: 12rpx 0 12rpx 0;
  padding: 2rpx 12rpx;
}
</style>
