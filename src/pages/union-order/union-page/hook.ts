import useState from '@/hooks/useState';
import { onGetUserOrderList } from '@/api/union-order';
import dayjs from 'dayjs';
interface StateType {
  page: number;
  start_time: string | number;
  end_time: string | number;
  searchKey: string;
  platform: string;
  orderData: H5UniOrderListRow[];
  nodata: boolean;
  loadingStatus: LoadingStatus;
  status: number;
  showtips: boolean;
  type: number;
}

export enum OrdersettleStatus {
  'created' = '下单后',
  'confirm' = '确认收货后',
  'settle' = '联盟结算后',
}

export default function useHookData<T>(props: any) {
  const { state, setData } = useState<StateType>({
    page: 1,
    start_time: props.start_time,
    end_time: props.end_time,
    searchKey: props.searchKey,
    platform: props.platform,
    orderData: [],
    nodata: false,
    loadingStatus: 'loading',
    status: props.status,
    type: props.type,
    showtips: false,
  });

  function isNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  // 获取订单列表
  const onLoadData = async (page) => {
    const current_page = page || 1;
    const uid = uni.getStorageSync('uid');
    const res = await onGetUserOrderList(uid, {
      page: current_page,
      platform: state.platform,
      status: state.status || undefined,
    });
    const data = res.list.map((item) => {
      item.is_self = uid == item.wx_id;
    });
    state.loadingStatus = res.list.length < 10 ? 'nomore' : 'loadmore';
    if (current_page === 1) {
      setData({ orderData: res.list, page: current_page, nodata: res.list.length === 0 });
    } else {
      state.orderData = state.orderData.concat(res.list);
    }
    return state.loadingStatus;
  };

  return { state, setData, onLoadData };
}
