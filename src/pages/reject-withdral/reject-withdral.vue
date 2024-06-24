<template>
  <view class="m-24 print">
    <textarea v-model="state.remark" auto-height style="font-size: 26rpx; min-height: 180rpx" placeholder="请输入拒绝的理由" placeholder-class="textarea-placeholder" />
    <view> </view>
  </view>
  <view class="mx-80 px-80 mt-80">
    <u-button shape="circle" @click="submit">提交</u-button>
  </view>
</template>
<script setup lang="ts">
import lineHook from '@/hooks/uni-hook';
import useHookData from './hook';
import { onRefuseWithdraw } from '@/api/union-order';
import useState from '@/hooks/useState';
import { onLoad } from '@dcloudio/uni-app';

const { state } = useState({
  remark: '',
  wx_id: '',
});
const { Toast } = lineHook();
// const {state,setData}=useHookData()

const submit = async () => {
  await onRefuseWithdraw({
    wx_id: state.wx_id,
    remark: state.remark,
  });
  Toast('操作成功');
  //   state.remark = '';
};
onLoad((option: any) => {
  state.wx_id = option.wx_id;
});
</script>
<style lang="scss" scoped>
.print {
  border: 1px solid #e5e5e5;
  border-radius: 20rpx;
  padding: 24rpx;
  font-size: 26rpx;
}
</style>
