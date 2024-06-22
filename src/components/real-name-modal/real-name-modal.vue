<template>
  <u-popup :show="state.isUpdateReal" mode="center" bg-color="transparent" @close="onClose">
    <view class="real-box">
      <view class="flex items-center">
        <view v-if="state.isEdit" class="f-bold f-32">收货人真实姓名和身份证号码保持一致，才可下单哦~</view>
        <view v-else class="c-333 mt-24">
          <view class="f-28">检测到您的下单地址收货人姓名和实名信息不一致！</view>
          <view class="mt-24 f-32 f-bold">请修改地址姓名或真实姓名</view>
        </view>
        <image src="https://storage.szline9.com/frontend/static/svg/real-name-icon.svg" class="flex-shrink ml-48" style="width: 132rpx; height: 100rpx" />
      </view>
      <view class="real-cell flex mt-60 c-333 f-32 items-center">
        <view class="flex-shrink">真实姓名</view>
        <view class="ml-24">
          <input v-model="realState.userName" type="text" class="ml-24 w-full py-24" placeholder="请输入真实姓名" />
        </view>
      </view>
      <u-line></u-line>
      <view class="real-cell flex c-333 f-32 items-center">
        <view class="flex-shrink">身份证号</view>
        <view class="ml-24">
          <input v-model="realState.idCard" type="idcard" maxlength="18" class="ml-24 w-full py-24" placeholder="请输入身份证号" />
        </view>
      </view>
      <u-line></u-line>
      <view class="mt-46">
        <u-button type="primary" shape="circle" :loading="realState.loading" @click="saveRealName">保存</u-button>
      </view>
    </view>
    <view class="flex flex-center mt-24" @click="onClose">
      <line-icon name="nine9-guanbi2  c-fff f-60"></line-icon>
    </view>
  </u-popup>
</template>
<script setup lang="ts">
import useState from '@/hooks/useState';
import usehookData from './hook';
import { watch, onMounted } from 'vue';

interface Isprops {
  modelValue: boolean;
  addressName: string;
  isRealaddressName?: boolean;
  isEdit: boolean;
}

const props = withDefaults(defineProps<Isprops>(), {
  modelValue: false,
  addressName: '',
  isRealaddressName: true,
  isEdit: false,
});

const emit = defineEmits(['update:modelValue', 'success']);

const { state } = useState({
  isUpdateReal: props.modelValue,
  isRealaddressName: props.isRealaddressName,
  isEdit: props.isEdit,
});

const { state: realState, submitRealName } = usehookData({ isConfirm: true });

const saveRealName = async () => {
  try {
    const res: any = await submitRealName();
    emit('update:modelValue', false);
    emit('success', res.real_name_id);
  } catch (e) {
    console.log(e, 53);
  }
};

const onClose = () => {
  emit('update:modelValue', false);
  realState.userName = '';
  realState.idCard = '';
};

onMounted(() => {
  realState.addressName = props.addressName;
  realState.ischeckRealeqAddress = props.isRealaddressName;
});
watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      onClose();
    }
    state.isUpdateReal = val;
  }
);
watch(
  () => props.isRealaddressName,
  (val) => {
    realState.ischeckRealeqAddress = val;
  }
);

watch(
  () => props.isEdit,
  (val) => {
    state.isEdit = val;
  }
);

watch(
  () => props.addressName,
  (val) => {
    realState.addressName = val;
  }
);
</script>
<style lang="scss" scoped>
.real-box {
  background: linear-gradient(180deg, #ffe6e6 0%, #ffffff 41%);
  width: 660rpx;
  box-sizing: border-box;
  padding: 38rpx 34rpx;
  border-radius: 20rpx;
}
</style>
