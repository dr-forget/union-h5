import useState from '@/hooks/useState';
import { provinceAndcity } from '@/api/common';
interface StateType {
  citysarr: provinceData[];
  province: provinceData[];
  citys: provinceData[];
  streets: provinceData[];
  selectKeys: number[];
  loading: boolean;
  showmodal: boolean;
  indicatorStyle: string;
}
export default function useHookData(props) {
  const { state, setData } = useState<StateType>({
    citysarr: [],
    province: [],
    citys: [],
    streets: [],
    selectKeys: [0, 0, 0],
    loading: true,
    showmodal: props.modelValue,
    indicatorStyle: `height: 40px;`,
  });

  const designateCity = () => {
    const [province, city, street] = state.selectKeys;
    const provinceArr = state.citysarr[province];
    const cityArr = provinceArr?.children || [];
    const streetArr = cityArr[city]?.children || [];
    return { provinceArr, cityArr, streetArr };
  };

  const onGetprovinceAndcity = async () => {
    const res = await provinceAndcity();
    state.citysarr = res;
    const { cityArr, streetArr } = designateCity();
    state.citys = cityArr;
    state.streets = streetArr;
    state.loading = false;
  };
  return { state, onGetprovinceAndcity, designateCity };
}
