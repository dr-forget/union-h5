<template>
  <view class="flex items-center flex-between" style="height: 106rpx">
    <view class="mr-16">
      <image src="https://storage.szline9.com/frontend/static/svg/real-name-iconsvg.svg" style="width: 50rpx; height: 50rpx"></image>
    </view>
    <view class="w-full flex items-center flex-between">
      <view>
        <view class="f-32 u-line-2">
          <text>{{ state.name || '添加支付人信息' }}{{ state.name ? '，' : '' }}</text>
          <text class="c-666 f-26">{{ state.idCard }}</text>
        </view>
        <view v-if="!state.idCard" class="c-666 f-22 mt-6">海关规定，购买跨境商品必须验证支付人信息</view>
      </view>
      <view v-if="state.idCard" class="f-32 flex-shrink ml-16" style="color: #fd7a55" @click.stop="emit('edit')">修改</view>
      <view v-else class="flex-shrink ml-12 add-real-tag" @click.stop="addRealName">填写 </view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import useStore from '@/store';
import useState from '@/hooks/useState';
import lineHook from '@/hooks/uni-hook';
import { watch } from 'vue';
interface Isprops {
  name: string;
  idCard: string;
  iseqRealName: boolean;
}

interface Isstate {
  name: string;
  idCard: string;
}

const emit = defineEmits(['edit']);

const props = withDefaults(defineProps<Isprops>(), {
  name: '',
  idCard: '',
  iseqRealName: false,
});

const { state, setData } = useState<Isstate>({
  name: props.name,
  idCard: props.idCard,
});

const { useShopBags } = useStore();

const { Toast, router } = lineHook();

const addRealName = () => {
  if (!useShopBags.addressinfo.receiver) {
    return Toast('请选择收货地址');
  }
  router.to(`/pages/order/real-name-auth/real-name?name=${encodeURIComponent(useShopBags.addressinfo?.receiver || '')}&realname=${props.iseqRealName ? 2 : 1}`);
};

watch([() => props.name, () => props.idCard], ([name, idCard]) => {
  setData({ name, idCard });
});
</script>

<style lang="scss" scoped>
.add-real-tag {
  width: 110rpx;
  height: 60rpx;
  border: 1px solid $uni-color-primary;
  border-radius: 12rpx;
  color: $uni-color-primary;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
}
</style>
