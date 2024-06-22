<template>
  <view class="radius-12 bg-white category-card hidden" @click="emit('click')">
    <image :src="$ossCdnImage(props.image, 334)" :style="{ height: props.spec ? '370rpx' : '390rpx' }" mode="aspectFill" lazy-load />
    <view class="height-content">
      <view class="tag m-12 mt-24">{{ props.tag_name }}</view>
      <view class="c-333 f-28 px-12 mt-24">{{ props.name }}</view>
      <view class="spec f-28 px-12 mt-16">{{ props.spec }}</view>
    </view>
  </view>
</template>
<script setup lang="ts">
interface Isprops {
  name: string;
  tag_name: string;
  spec?: string;
  image: string;
}

const props = withDefaults(defineProps<Isprops>(), {
  name: '',
  tag_name: '',
  spec: '',
  image: '',
});

const emit = defineEmits(['click']);
</script>
<style lang="scss" scoped>
.category-card {
  width: 344rpx;
  height: 580rpx;
  box-sizing: border-box;

  image {
    width: 344rpx;
    height: 344rpx;
  }

  .tag {
    background: #6ba6b8;
    color: #fff;
    border-radius: 50rpx;
    height: 40rpx;
    font-size: 28rpx;
    width: fit-content;
    padding: 0 20rpx;
    align-items: center;
  }

  .height-content {
    padding-bottom: 16rpx;
    box-sizing: border-box;
  }

  .spec {
    color: #6ba6b8;
  }
}
</style>
