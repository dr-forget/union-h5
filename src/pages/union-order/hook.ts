import useState from '@/hooks/useState';
import { onGetUserOrderList } from '@/api/union-order';
import { PLATFORMSENUM } from '@/enums/plat_form';
interface StateType {
  platforms: TabsType[];
  current: number;
  uid: string;
  status_current: number;
  commission_status: TabsType[];
}
export default function useHookData() {
  const { state, setData } = useState<StateType>({
    platforms: [
      {
        name: '全部',
        value: '',
      },
      {
        name: '淘宝',
        value: PLATFORMSENUM.TAO_BAO,
      },
      {
        name: '京东',
        value: PLATFORMSENUM.JD,
      },
      {
        name: '拼多多',
        value: PLATFORMSENUM.PIN_DUO_DUO,
      },
      {
        name: '快手',
        value: PLATFORMSENUM.KUAI_SHOU,
      },
    ],
    commission_status: [
      {
        name: '全部',
        value: 0,
      },
      // {
      //   name: '冻结中',
      //   value: 1,
      // },
      {
        name: '待结算',
        value: 1,
      },
      {
        name: '已结算',
        value: 2,
      },
      {
        name: '已失效',
        value: 3,
      },
    ],
    current: 0,
    status_current: 0,
    uid: '',
  });

  const onGetOrderList = async (page?: number) => {
    const current_page = page || 1;
    const res = await onGetUserOrderList(state.uid, {
      platform: state.platforms[state.current].value,
      page: current_page,
    });
    console.log(res, 39);
  };
  return { state, setData, onGetOrderList };
}
