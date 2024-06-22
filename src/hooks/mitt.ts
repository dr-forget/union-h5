import { MittType } from '@/utils/emitType';
import { ref } from 'vue';
import { onLoad, onUnload } from '@dcloudio/uni-app';
export default function useMitt(key: MittType, status = true) {
  const isonOffStatus = ref(status);
  let fun = ref({
    fn: () => {},
  });
  const $on = (fn: (val?: any) => void) => {
    fun.value.fn = fn;
    uni.$on(key, fn);
  };
  const $emit = (data?: any) => {
    uni.$emit(key, data);
  };
  const $off = () => {
    uni.$off(key, fun.value.fn);
  };
  onUnload(() => {
    if (isonOffStatus.value) {
      uni.$off(key, fun.value.fn);
    }
  });
  return { $on, $emit, $off };
}
