<template>
  <u-popup
    mode="center"
    :show="state.show"
    :safe-area-inset-bottom="false"
    :closeable="props.closeable"
    bg-color="transparent"
    close-on-click-overlay
    closeable-color="#fff"
    @close="emit('update:modelValue', false)"
  >
    <view class="hidden">
      <image :src="state.url" mode="widthFix" class="poster" show-menu-by-longpress />
      <slot>
        <view class="flex share-box" @click="emit('update:modelValue', false)">
          <button class="item" @click.stop="showshareImageMenu">
            <image src="https://jiu-shop-static.oss-cn-shenzhen.aliyuncs.com/newStatic/icon38.png" />
            <view class="title">保存图片</view>
          </button>
        </view>
      </slot>
    </view>
  </u-popup>
</template>
<script lang="ts" setup>
import lineHook from '@/hooks/uni-hook';
import useState from '@/hooks/useState';
import { watch } from 'vue';
interface Isprops {
  modelValue: boolean;
  imgurl: string;
  closeable?: boolean;
}

const emit = defineEmits(['update:modelValue']);

const { saveImage } = lineHook();

const props = withDefaults(defineProps<Isprops>(), {
  modelValue: false,
  imgurl: '',
  closeable: true,
});

const { state } = useState({
  show: props.modelValue,
  url: props.imgurl,
});

const showshareImageMenu = async () => {
  // #ifndef MP-WEIXIN
  saveImage(state.url);
  // #endif
  // #ifdef MP-WEIXIN
  try {
    await uni.showShareImageMenu?.({ path: state.url });
  } catch (e) {}
  // #endif
};

watch(
  () => props.modelValue,
  (val) => {
    state.show = val;
  }
);
watch(
  () => props.imgurl,
  (val) => {
    state.url = val;
  }
);
</script>
<style lang="scss" scoped>
.poster {
  width: 570rpx;
}

.share-box {
  padding: 30rpx 80rpx 0rpx 80rpx;

  button {
    background: transparent;
    font-size: 24rpx;
    color: #fff;
    line-height: 1;

    &::after {
      border: none;
    }
  }

  image {
    width: 92rpx;
    height: 92rpx;
  }
}
</style>
