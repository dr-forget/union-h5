import useState from '@/hooks/useState';
import lineHook from '@/hooks/uni-hook';
import useStore from '@/store';
import { realNameAuth } from '@/api/order';
import { checkID } from './utils';
interface StateType {
  userName: string;
  idCard: string;
  confirm: string[];
  showTips: boolean;
  addressName: string;
  loading: boolean;
  ischeckRealeqAddress: boolean;
}
interface ParamsProps {
  isConfirm?: boolean;
  ischeckRealeqAddress?: boolean;
}
export default function useHookData({ isConfirm = false, ischeckRealeqAddress = true }: ParamsProps) {
  const { Toast } = lineHook();
  const { useAppConfig } = useStore();
  const { state, setData } = useState<StateType>({
    userName: '',
    idCard: '',
    confirm: isConfirm ? ['1'] : [],
    showTips: false,
    addressName: '',
    loading: false,
    ischeckRealeqAddress: ischeckRealeqAddress || true,
  });

  const submitRealName = () => {
    return new Promise((resolve, reject) => {
      if (!state.addressName) {
        Toast('请先选择收货地址');
        return reject();
      }
      if (!state.userName) {
        Toast('请输入身份证姓名');
        return reject();
      }
      if (state.ischeckRealeqAddress && state.userName !== state.addressName) {
        Toast('检测到您的下单地址收货人姓名和实名信息不一致，请修改地址姓名或真实姓名');
        return reject();
      }
      if (!state.idCard) {
        Toast('请输入身份证号码');
        return reject();
      }
      // 严格模式
      if (useAppConfig.runConfig.realstrictMode) {
        if (!checkID(state.idCard)) {
          Toast('请输入正确的身份证号码');
          return reject();
        }
      }
      // 简易模式  简易模式 仅校验身份证格式是否正确
      if (!useAppConfig.runConfig.realstrictMode) {
        const idRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (!idRegex.test(state.idCard)) {
          Toast('请输入正确的身份证号码');
          return reject();
        }
      }
      if (!state.confirm.length) {
        Toast('请勾选实名认证协议');
        return reject();
      }
      try {
        state.loading = true;
        const res = realNameAuth({
          name: state.userName,
          card_no: state.idCard,
        });
        resolve(res);
      } finally {
        state.loading = false;
      }
    });
  };

  return { state, setData, submitRealName };
}
