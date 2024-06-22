import useState from '@/hooks/useState';
import useStore from '@/store';
import lineHook from '@/hooks/uni-hook';
import { isEqual, cloneDeep, debounce, throttle } from 'lodash';

interface Istate {
  skuList: SkuType[]; //当前商品的sku
  attrNames: AttributeType[]; //当前商品的属性名
  show: boolean; //是否显示
  skuItem: Partial<SkuType>; //当前选中的sku
  selectSkuIds: { id: number; specid: number }[]; //当前选中的skuId
  buyBtndisabled: boolean; //购买按钮是否禁用
  postage: number; //邮费
  submitLoading: boolean; //提交订单loading
  discountList: DiscountListType[]; //命中的优惠信息
  disCountObj: Partial<DiscountListType>; //命中的优惠信息
  isPresale: boolean; //是否预售
  is_discount: boolean; //是否有优惠
  isFirst: boolean;
}

export default function usehookData(props: any) {
  const { useShopBags, useUserData } = useStore();
  const { state, setData } = useState<Istate>({
    attrNames: props.attrNames,
    skuList: props.skuList,
    show: props.show,
    skuItem: {},
    selectSkuIds: [],
    buyBtndisabled: false,
    postage: 0,
    submitLoading: false,
    discountList: [],
    disCountObj: {},
    isPresale: props.isPresale,
    is_discount: props.is_discount,
    isFirst: true,
  });

  // 初始化选中
  const initSelect = () => {
    // 直接拿第1个sku就行 与后端协商最低的拍最前
    const minSku = state.skuList[0] || {};
    const skuids = minSku?.attributes?.map((item) => ({ id: item.id, specid: item.spec_id })) || [];
    if (minSku.stock == 0) {
      // 整个sku已售罄
      state.buyBtndisabled = true;
    }
    // // 库存大于0的sku 才添加购物车
    // if (state.skuList.length == 1) {
    //   minSku.stock > 0 && useShopBags.cart_skus.push({ ...minSku, select_stock: 1 } as SkuType);
    // }
    setData({ selectSkuIds: skuids || [], skuItem: { ...minSku, select_stock: 1 } || {} });
    // 设置选中的库存
    setSelectStock();
    // 计算邮费
    calcPostage([state.skuItem]);
  };

  const combineSKUs = (baseSKU: { id: number; specid: number }, skuArrays: { id: number; name: string }[][]): string[] => {
    const result: string[] = [];
    const combine = (index: number, current: Record<string, number>) => {
      if (index === skuArrays.length) {
        result.push(Object.values(current).join('-'));
        return;
      }
      const currentArray = skuArrays[index];
      for (let i = 0; i < currentArray.length; i++) {
        const updated = { ...current };
        updated[`specid${index + 2}`] = currentArray[i].id;
        combine(index + 1, updated);
      }
    };
    // @ts-ignore
    combine(0, { specid: baseSKU.specid });
    return result;
  };

  const setSelectStock = () => {
    let skuids: string[] = [];
    // 获取最后一项option 用于组合sku
    const lastoption = state.attrNames[state.attrNames.length - 1].options.map((item) => item);
    // 如果单规格
    if (state.attrNames.length == 1) {
      const [singleSpec] = cloneDeep(state.attrNames);
      skuids = singleSpec.options.map((item) => `${item.id}`);
    } else {
      // 第一个 和 最后一个 不需要重新组合  掐头去尾高级算法
      const selectIds = cloneDeep(state.selectSkuIds.slice(1, state.selectSkuIds.length - 1));
      // 属性规格 也进行掐头去尾算法
      const attrNames = cloneDeep(state.attrNames.slice(1, state.attrNames.length - 1));

      // 多规格属性的情况下 查询中间部分的规格属性
      const handleRow = selectIds.map((item, i) => {
        const currt_attr = attrNames[i];
        // 获取当前规格属性的所有选项
        return currt_attr.options.filter((opt) => opt.id == item.specid);
      });
      const [firstSku] = state.selectSkuIds;
      // 如果没有选中的规格属性 则直接组合sku
      if (!handleRow.length) {
        //  组合sku
        skuids = combineSKUs(firstSku, [lastoption]);
      } else {
        skuids = combineSKUs(firstSku, [...handleRow, lastoption]);
      }
    }
    // 根据skuids 找出购物车的选中的select_stock //如果购物车存在  则直接取购物车的数据 否则从skulist中取  //购物车的数据与skuList的数据一致
    skuids.map((item, i) => {
      // 获取所有的ID
      const ids = item.split('-');
      // 重新组合完整的skuid
      const skuid = ids.map((item, i) => `${state.attrNames[i].id}-${item}`).join('-');
      // 先查找购物中是否存在该skuid
      const skuitem = useShopBags.cart_skus.find((item) => item.attribute_id == skuid);
      // 购物车中不存在该skuid 则从skulist中取
      if (!skuitem) {
        const skuitem = state.skuList.find((item) => item.attribute_id == skuid);
        lastoption[i].select_stock = skuitem?.select_stock || 0;
        lastoption[i].stock = skuitem?.stock || 0;
      } else {
        lastoption[i].select_stock = skuitem?.select_stock || 0;
        lastoption[i].stock = skuitem?.stock || 0;
      }
    });
  };

  const spuListItemClick = (attrIndex: number, attrId: number, specId: number) => {
    // 点击的规格属性
    const handleobj = { id: attrId, specid: specId };
    // 查看当前选中的规格属性
    const currentSpec = state.selectSkuIds[attrIndex];

    const status = isEqual(handleobj, currentSpec);
    // 如果重复点击同一个规格属性 则不做任何操作
    if (status) return;

    state.selectSkuIds[attrIndex] = handleobj;

    // 如果操作的不是最后一个规格属性 把选择的规格属性的select_stock设置为0
    if (attrIndex !== state.attrNames.length - 1) {
      setSelectStock();
    }
    // 构造一个新的skuId
    const skuid = state.selectSkuIds.map((item) => `${item.id}-${item.specid}`).join('-');
    // 找出当前sku
    const skuItem = state.skuList.find((opt) => opt.attribute_id == skuid);
    state.skuItem = skuItem || {};
    if (!useShopBags.cart_skus.length) {
      calcPostage([state.skuItem]);
    }
  };

  // 预览图片
  const previewImage = (url: string) => {
    uni.previewImage({
      current: url,
      urls: [url],
    });
  };

  // 数量变更 更改购物车
  const cartChange = (event, attrIndex: number, attrId: number, specId: number, specIndex) => {
    state.isFirst = false;
    spuListItemClick(attrIndex, attrId, specId);

    const specValue = state.attrNames[attrIndex].options[specIndex];

    specValue.select_stock = event.value;
    // 当前选中的sku
    const skuid = state.selectSkuIds.map((item) => `${item.id}-${item.specid}`).join('-');
    // 查找索引位置 后续用于修改数量
    const skuCartIndex = useShopBags.cart_skus.findIndex((item) => item.attribute_id == skuid);
    const skuCartitem = useShopBags.cart_skus[skuCartIndex];
    //
    state.buyBtndisabled = false;
    // 如果库存变更为0 则删除该sku
    if (specValue.select_stock == 0) {
      useShopBags.cart_skus.splice(skuCartIndex, 1);
      // 当没有sku了 拿当前sku去试算
      calcPostage(useShopBags.cart_skus.length < 1 ? [state.skuItem] : []);
      return;
    }
    // 如果存在该sku则修改数量
    if (skuCartIndex > -1) {
      // 如果库存变更为0 则删除该sku
      specValue.select_stock == 0 ? useShopBags.cart_skus.splice(skuCartIndex, 1) : (skuCartitem.select_stock = specValue.select_stock);
      calcPostage();
      return;
    }
    // 如果不存在则添加
    useShopBags.cart_skus.push({ ...state.skuItem, select_stock: specValue.select_stock } as SkuType);
    // 计算邮费
    calcPostage();
  };

  // 计算邮费
  const calcPostage = debounce((skuList?: any[]) => {
    if (useUserData.userinfo.token) {
      useShopBags.calcPostage(skuList || []);
    }
  }, 400);

  return { state, setData, initSelect, previewImage, spuListItemClick, cartChange, calcPostage };
}
