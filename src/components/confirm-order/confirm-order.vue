<template>
  <u-popup :show="state.show" title="确认订单" :round="16" closeable :z-index="997" :overlay-style="{ zIndex: 997 }" title_border @close="emit('update:show', false)">
    <scroll-view scroll-y :style="{ maxHeight: scrollMaxHeight + 'px' }" class="scroll-view">
      <view class="relative">
        <view
          class="address-box flex items-center px-26"
          :style="{ height: addressText ? '130rpx' : '110rpx' }"
          @click.stop="router.to(`/pages/user/addressList-auth/addressList?type=${AddressOpenClass.CONFRIME_SUBMIT_ORDER}`)"
        >
          <u-skeleton :loading="useShopBags.addressLoading" rows="1" avatar>
            <address-info :name="useShopBags.addressinfo.receiver" :mobile="useShopBags.addressinfo.mobile" :address="addressText"></address-info>
          </u-skeleton>
        </view>
        <view v-if="props.source == ShopSource.SEA_AMOY_GOODS" class="px-26">
          <u-line color="#e9e9e9"></u-line>
        </view>
        <view v-if="props.source == ShopSource.SEA_AMOY_GOODS" class="px-26">
          <real-info :name="useShopBags.realInfo.name" :need_real_name_eq_address_name="props.iseqRealName" :id-card="useShopBags.realInfo.card_no" @edit="emit('realChange', true)"></real-info>
        </view>
        <u-gap height="10" bg-color="#f6f6f6"></u-gap>
        <view class="sky-shop">
          <view class="px-30 py-24 flex items-center">
            <view class="shop-image flex-shrink" @click.stop="previewImage(state.skuItem?.sku_image || '')">
              <image mode="aspectFill" class="" :src="$ossCdnImage(state.skuItem?.sku_image || '', 360)"> </image>
              <view v-if="state.skuItem.stock == 0" class="img-mask flex items-center flex-center">
                <image class="sell-out" src="https://jiu-shop-static.oss-cn-shenzhen.aliyuncs.com/uploads/20230503/fecdd91cce1a798ae9c162b51e8e01b2.png"> </image>
              </view>
            </view>
            <view class="shop-price ml-30">
              <view class="c-price f-44 f-bold flex items-center">
                <text class="f-32">￥</text>
                <text>{{ $formatMoney(state.skuItem?.price || 0) }}</text>
                <view v-if="useShopBags.discount_list.length" class="discount-tag">
                  <!-- 不能删 -->
                  <view class="tag"></view>
                  <text class="text">到手{{ useShopBags.discount_unit_pirce }}元/件</text>
                </view>
              </view>
              <view class="flex">
                <commission-tag :is_subsidy="state.skuItem.is_subsidy" :high_commission="state.skuItem.subsidy_commission" :price="state.skuItem.commission"></commission-tag>
              </view>
              <view class="c-gray f-28 mt-6">
                <text>库存：</text>
                <text>{{ state.skuItem?.stock?.toString() ? `${state.skuItem.stock}件` : '' }}</text>
              </view>
              <view class="c-666 f-28 mt-8 u-line-1">已选：{{ selectSkuText }}</view>
            </view>
          </view>

          <!-- 优惠 -->
          <view v-if="state.is_discount" class="mx-26">
            <u-line color="#e9e9e9"></u-line>
          </view>
          <view v-if="state.is_discount" class="mx-26 flex flex-between py-24">
            <view class="flex items-center">
              <view class="flex-shrink mr-12 f-32">优惠</view>
              <scroll-view scroll-x style="max-width: 480rpx">
                <view class="flex items-center">
                  <text v-if="useShopBags.discount_list.length" class="f-26 mr-4 c-primary mt-4 f-middle">已享</text>
                  <text v-for="(item, i) in useShopBags.discount_list" :key="i" class="mr-4 mt-4 c-primary f-26 flex items-center f-middle flex-shrink">
                    {{ item.discount_tag }}{{ i == useShopBags.discount_list.length - 1 ? '' : '，' }}
                  </text>
                </view>
              </scroll-view>
            </view>
            <text v-if="useShopBags.discount_list.length == 0" class="f-26 mt-4 flex items-center c-999">选择规格后查看优惠</text>
            <view v-if="useShopBags.discount_list.length" class="flex-shrink ml-24 mt-4 c-primary f-middle f-26 flex items-center">
              已减￥{{ $formatMoney(useShopBags.discount_price < 0 ? 0 : useShopBags.discount_price) }}
            </view>
          </view>
        </view>
        <view v-if="state.is_discount" class="mx-26 mb-12">
          <u-line color="#e9e9e9"></u-line>
        </view>
        <!-- sku 选择 -->
        <!-- 遍历规格名 -->
        <view v-for="(item, i) in state.attrNames" :key="i" class="px-26 f-32">
          <view class="mb-20 flex flex-between items-center">
            <text>{{ item.name }}</text>
            <u-transition :show="useShopBags.sell_discount.add_number > 0 && i == state.attrNames.length - 1 && !state.isFirst">
              <view class="transition">
                <view class="flex flex-center f-26 discount-box c-primary f-middle">
                  再选{{ useShopBags.sell_discount.add_number }}件立减{{ $formatMoney(+useShopBags.sell_discount.discount_price < 0 ? 0 : useShopBags.sell_discount.discount_price) }}元
                </view>
              </view>
            </u-transition>
          </view>
          <!-- 遍历子项 -->
          <view v-for="(attr, index) in item.options" :key="index" class="mb-20" :class="{ ...attrNamesClass(i, item.id, attr.id) }" @click.stop="spuListItemClick(i, item.id, attr.id)">
            <view :class="{ 'attr-item attr-next-active': i == state.attrNames.length - 1 }" class="relative">
              <text> {{ attr.name }}</text>
              <view v-if="i == state.attrNames.length - 1 && attr.stock == 0" class="outofstock">缺货</view>
            </view>
            <!-- 最后一项才有number-box 跳转 -->
            <view v-if="i == state.attrNames.length - 1" class="flex-shrink ml-36 number-box">
              <number-box
                v-model="attr.select_stock"
                :max="attr.stock"
                :min="1"
                async-change
                :disabled="i == state.attrNames.length - 1 && attr.stock == 0"
                @add="addCart"
                @change="cartChange($event, i, item.id, attr.id, index)"
              ></number-box>
            </view>
          </view>
          <view class="mt-6 mb-20">
            <u-line color="#e9e9e9"></u-line>
          </view>
        </view>
        <view class="pb-70">
          <view class="flex flex-between px-26 f-32">
            <text>运费</text>
            <text>￥{{ $formatMoney(useShopBags.postage) }}</text>
          </view>
          <view v-if="useShopBags.cart_skus.length <= 1" class="flex flex-between px-26 mt-20 mb-30 c-333 f-32">
            <text class="flex-shrink mr-36">备注</text>
            <input v-model="useShopBags.remark" placeholder="填写备注信息" :cursor-spacing="20" class="t-right w-full" @input="reamarkInput" />
          </view>
        </view>
        <view class="safe-area-inset-height safe-area-inset-bottom"></view>
        <view class="buy-footer safe-area-inset-bottom" catchtouchmove @tap.stop>
          <view class="flex items-center flex-between mx-50 h-full">
            <view class="flex items-center">
              <l-ball ref="ballRef" :duration="400" :isinit-height="false">
                <template #default="{ active }">
                  <view class="relative shopcart" @tap.stop="confrimOrder">
                    <view class="badge" :class="{ 'cart-count': active }">
                      <u-badge max="99" :value="cartTotalPrice.total_number"></u-badge>
                    </view>
                    <image src="https://storage.szline9.com/frontend/static/svg/add-cart.svg" style="width: 42rpx; height: 42rpx"> </image>
                    <view class="f-24 c-666 mt-8">已选</view>
                  </view>
                </template>
              </l-ball>
              <view v-if="useUserData.userinfo.proxy_level !== ProxyLevelEnum.VERMICELLI" class="c-gold ml-50 t-center" @click.stop="showCommiseModal">
                <view class="f-28">￥{{ $formatMoney(useShopBags.commisinfo.discount_commission_total + useShopBags.commisinfo.origin_commission_total) }}</view>
                <view class="f-24 flex items-center flex-center">
                  <text>佣金</text>
                  <view class="mt-6 ml-4">
                    <u-icon name="question-circle" color="#FD7A55" size="24rpx"></u-icon>
                  </view>
                </view>
              </view>
            </view>
            <view class="ml-50 w-full">
              <u-button
                type="primary"
                shape="circle"
                :loading="state.submitLoading"
                :disabled="state.buyBtndisabled || state.skuItem.stock == 0 || state.isPresale"
                :custom-style="{
                  height: '90rpx',
                }"
                @click="submitOrder"
              >
                <view>
                  <text class="ml-8 f-36">￥{{ $formatMoney(useShopBags.user_total_price) }}</text>
                  <text v-if="useShopBags.discount_price" class="ml-8 f-32 t-through ml-12 transparent">￥{{ cartTotalPrice.origin_price }}</text>
                  <view class="f-24" :class="{ 'inline-block ml-4 f-32': !state.is_discount }">立即支付</view>
                </view>
              </u-button>
            </view>
          </view>
        </view>
        <!-- useShopBags.postageLoading -->
        <u-transition :show="useShopBags.postageLoading">
          <view class="transition">
            <view class="loading">
              <image src="./loading.svg"></image>
            </view>
          </view>
        </u-transition>
      </view>
    </scroll-view>
  </u-popup>
</template>
<script setup lang="ts">
import useStore from '@/store';
import useHookData from './hook';
import addressInfo from './address-info.vue';
import numberBox from './number-box.vue';
import realInfo from './real-info.vue';
import lineHook from '@/hooks/uni-hook';
import useMitt from '@/hooks/mitt';
import useSubmitOrder from './submit-order';
import { ProxyLevelEnum } from '@/enum/proxy';
import { throttle, debounce } from 'lodash';
import { MittType } from '@/utils/emitType';
import { ShopSource, AddressOpenClass } from '@/enum/comm';
import { computed, watch, nextTick, ref, onMounted, onUnmounted } from 'vue';

interface Isprops {
  show: boolean;
  skuList: SkuType[];
  attrNames: AttributeType[];
  source: ShopSource;
  isActivity?: boolean; //是否是合集页
  isScroll?: number; //是否需要发起滚动消息
  iseqRealName: boolean; //是否需要判断地址名称与实名信息一致
  ispresals: boolean | number; //是否预售
  is_discount: boolean; //是否有优惠
}

const { submitPay } = useSubmitOrder();

const $mitt = useMitt(MittType.SHOPPING_BAG_UPDATE);
// sku异步更新
const skuSelectUpate = useMitt(MittType.UPDATE_SELECTED_SKU);

const ballRef = ref<any>(null);

const emit = defineEmits(['update:show', 'realChange']);

const { useAppConfig, useUserData, useShopBags } = useStore();

const { router, Toast, showModal } = lineHook();

const addressText = computed(() => {
  return (useShopBags.addressinfo.province || '') + (useShopBags.addressinfo.city || '') + (useShopBags.addressinfo.area || '') + (useShopBags.addressinfo.address || '');
});

const selectSkuText = computed(() => {
  return state.skuItem.attributes?.map((item) => `${item.spec_name}`).join('、');
});

// 计算购物袋总金额
const cartTotalPrice = computed(() => {
  // 计算总价格 和 总数量
  let price = 0,
    total_number = 0;
  useShopBags.cart_skus.map((item) => {
    price += (item.select_stock || 1) * item.price;
    total_number += item.select_stock;
  });

  const total_price = (useShopBags.cart_skus.length == 0 ? state.skuItem.price : price) || 0;
  return {
    origin_price: uni.$formatMoney(total_price + useShopBags.postage),
    total_number,
  };
});

// 生成attrNames class
const attrNamesClass = (attrIndex, attrId, specId) => {
  const skuIdItem = state.selectSkuIds[attrIndex] || {};
  const classObj = {
    'attr-active ': skuIdItem?.id == attrId && skuIdItem?.specid == specId && attrIndex !== state.attrNames.length - 1,
    'attr-next': skuIdItem?.id == attrId && skuIdItem?.specid == specId && attrIndex == state.attrNames.length - 1,
    'inline-block attr-item mr-20': attrIndex !== state.attrNames.length - 1,
    'flex items-center flex-between': attrIndex == state.attrNames.length - 1,
  };
  return classObj;
  // 'attr-active': state.selectSkuIds[i].id == item.id && attr.id == state.selectSkuIds[i].specid, 'inline-block attr-item': i !== state.attrNames.length - 1
};

// 计算最大scroll-view的高度
const scrollMaxHeight = computed(() => {
  // 底部支付高度
  const buyfooterheight = uni.upx2px(110);
  // 弹窗title
  const popuptitleHeight = uni.upx2px(60);
  // 内容区高度
  const contentHeight = buyfooterheight + popuptitleHeight;
  const height = useAppConfig.systemConfig.screenHeight - useAppConfig.systemConfig.navbarHeight - contentHeight - 20;
  return height;
});

const props = withDefaults(defineProps<Isprops>(), {
  show: false,
  skuList: () => [],
  attrNames: () => [],
  source: ShopSource.SELF_SUPPORT,
  isRealName: false,
  isScroll: 2,
  isActivity: false,
});

const { state, setData, initSelect, previewImage, spuListItemClick, cartChange, calcPostage } = useHookData(props);

const addCart = (e) => {
  ballRef.value.action(e);
};

const showCommiseModal = () => {
  showModal({
    title: '',
    content: `已享优惠的${useShopBags.commisinfo.discount_sum}件：佣金￥${uni.$formatMoney(useShopBags.commisinfo.discount_commission_total)}\n 原价的${
      useShopBags.commisinfo.orgin_price_total
    }件：佣金￥${uni.$formatMoney(useShopBags.commisinfo.origin_commission_total)}`,
    showCancel: false,
    confirmText: '我知道了',
  });
};

// 确认订单
const confrimOrder = () => {
  if (!useShopBags.cart_skus.length) {
    return Toast('请添加加购商品');
  }

  router.to('/pages/order/confirm-order-auth/confirm-order', {
    isEqrealName: props.iseqRealName ? 2 : 1,
    isActivity: props.isActivity,
    isScroll: props.isScroll,
    skuLength: state.skuList.length,
  });
};

const reamarkInput = debounce(() => {
  if (useShopBags.cart_skus.length == 1) {
    useShopBags.cart_skus[0].remark = useShopBags.remark;
  }
}, 500);

const checkReal = (tips?: boolean) => {
  const source = useShopBags.cart_skus.length ? useShopBags.cart_skus[0]?.source : state.skuItem.source;
  if (source !== ShopSource.SEA_AMOY_GOODS) {
    return true;
  }
  // ID不存在 不比较
  if (!useShopBags?.realInfo.id || !useShopBags.addressinfo?.id) {
    tips && Toast('请添加支付人信息');
    return false;
  }
  if (props.iseqRealName && useShopBags.realInfo.name != useShopBags.addressinfo.receiver) {
    emit('realChange', false);
    return false;
  }

  return true;
};

const submitOrder = throttle(async () => {
  // 没有购物袋 处理成当前选中的sku
  // 单规格

  if (useShopBags.cart_skus.length == 1 || !useShopBags.cart_skus.length) {
    // 直接发起支付
    try {
      if (!checkReal(true)) return;
      state.submitLoading = true;
      const result = await submitPay(useShopBags.cart_skus.length ? {} : state.skuItem);
      // 库存校验不合格 给提示
      if (result.code == 1) {
        const [sku] = result.data;
        // 更新sku中当前sku的库存
        const skuIditem = state.skuList.find((item) => item.id == sku.id) || { stock: 0, attribute_id: '', id: 0 };
        skuIditem.stock = sku.stock;
        if (skuIditem.id == state.skuItem.id) {
          state.skuItem.stock = sku.stock;
        }
        const attr_ids = skuIditem?.attribute_id.split('-') || [];
        const last_attr_id = attr_ids[attr_ids.length - 1];
        const attrLasteOptions = state.attrNames[state.attrNames.length - 1];
        attrLasteOptions.options.map((item) => {
          if (item.id == +last_attr_id) {
            item.stock = sku.stock;
            item.select_stock = sku.stock;
          }
        });
        if (sku.stock == 0) {
          state.buyBtndisabled = true;
          return Toast(`当前商品库存已抢完`);
        }
        return Toast(`当前商品库存仅剩${sku.stock}件,系统已自动修正库存，请重新提交`);
      }
      // 重置购物袋
      if (result.code == 0) {
        const orderid = result.orders?.[0]?.order_id;
        result.payresult
          ? router.to('/pages/order/pay-success/pay-success', {
              id: orderid,
              price: useShopBags.user_total_price,
              spu_id: useShopBags.cart_skus.length ? useShopBags.cart_skus[0].spu_id : state.skuItem.spu_id,
            })
          : router.to('/pages/order/order-list-auth/order-list');
        emit('update:show', false);
        // 重置当前spu 库存
        useShopBags.cart_skus.map((item) => {
          const skuItem = state.skuList?.filter((opt) => opt.id == item.id)[0] || { stock: 0 };
          skuItem.stock = skuItem.stock - item.select_stock;
        });
        // 重置购物袋
        useShopBags.restStore();
        nextTick(() => {
          initSelect();
        });
      }
    } finally {
      state.submitLoading = false;
    }

    return;
  }
  router.to(`/pages/order/confirm-order-auth/confirm-order`, {
    isEqrealName: props.iseqRealName ? 2 : 1,
    isActivity: props.isActivity,
    isScroll: props.isScroll,
    skuLength: state.skuList.length,
  });
  // 多规格
}, 500);
watch(
  () => props.show,
  (show) => {
    if (show) {
      nextTick(async () => {
        // 计算加购位置
        const iconHeight = uni.upx2px(108);
        const top = useAppConfig.systemConfig.screenHeight - iconHeight;
        const left = uni.upx2px(10);
        // icon 宽度
        const width = uni.upx2px(48);
        //
        const height = uni.upx2px(86);
        ballRef.value?.setTarget({ left, top, width, height });
      });
    } else {
    }
    state.show = show;
  }
);

watch([() => props.attrNames, () => props.skuList], ([attrNames, skuList]) => {
  setData({ attrNames, skuList });
});

watch([() => props.ispresals, () => props.is_discount], ([ispresals, is_discount]) => {
  setData({
    isPresale: Boolean(ispresals),
    is_discount,
  });
});

// 检测海淘品的实名认证信息
watch([() => useShopBags.addressinfo.id, () => useShopBags.realInfo.name], ([id, skuList]) => {
  if (useShopBags.addressinfo.receiver !== useShopBags.realInfo.name && props.source == ShopSource.SEA_AMOY_GOODS && props.iseqRealName) {
    // 实名认证和收货人不一致
    emit('realChange', false);
  }
  // 监听地址变更 计算运费
  if (id) {
    calcPostage();
  }
});
onMounted(() => {
  $mitt.$on((data: SkuType) => {
    // 排除最后一项规格 对比其他的规格 如果前几项规格ID不变 则证明操作的是当前选中的sku的数量 更新数量即可
    const ids = data.attribute_id.split('-');
    ids.splice(ids.length - 1, 1);
    const currtskuids = state.skuItem.attribute_id?.split('-') || [];
    currtskuids.splice(currtskuids.length - 1, 1);
    if (ids.join('') == currtskuids.join('') && data.key == 'update') {
      const attrLasteOptions = state.attrNames[state.attrNames.length - 1];
      const ids = data.attribute_id.split('-');
      const lastOptionsIds = ids[ids.length - 1];
      attrLasteOptions.options.map((item) => {
        if (item.id == +lastOptionsIds) {
          item.stock = data.stock;
          item.select_stock = data.select_stock;
        }
      });
    }
    // 如果是删除 则选中上一个sku
    if (data.key == 'delete' && ids.join('') == currtskuids.join('')) {
      // 删除选中上一个sku
      const attrLasteOptions = state.attrNames[state.attrNames.length - 1];
      const ids = data.attribute_id.split('-');
      const lastOptionsIds = ids[ids.length - 1];
      const lastcart = useShopBags.cart_skus[useShopBags.cart_skus.length - 1];
      const selectSkuIds = lastcart.attributes.map((item) => ({ id: item.id, specid: item.spec_id }));
      state.selectSkuIds = selectSkuIds;
      state.skuItem = lastcart;
      attrLasteOptions.options.map((item) => {
        if (item.id == +lastOptionsIds) {
          item.stock = data.stock;
          item.select_stock = 0;
        }
      });
    }
  });
  skuSelectUpate.$on((sku) => {
    const skuids = sku?.attributes?.map((item) => ({ id: item.id, specid: item.spec_id })) || [];
    setData({ selectSkuIds: skuids, skuItem: sku });
  });
});

onUnmounted(() => {
  emit('update:show', false);
  $mitt.$off();
  skuSelectUpate.$off();
});
defineExpose({
  initSelect,
});
</script>

<style lang="scss" scoped>
.address-box {
  height: 170rpx;
  /* border-top: 1px solid #d8d8d8; */
}

.shopcart {
  width: 48rpx;
  height: 86rpx;
}

.shop-image {
  width: 170rpx;
  height: 170rpx;
  border-radius: 12rpx;
  overflow: hidden;
  position: relative;

  image {
    width: 100%;
    height: 100%;
  }

  .img-mask {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba($color: #000000, $alpha: 0.4);

    .sell-out {
      width: 180rpx;
      height: 104rpx;
    }
  }
}

.scroll-view {
  box-sizing: border-box;
}

.attr-item {
  background: #f4f5f7;
  color: #2d3341;
  border-radius: 12rpx;
  padding: 6rpx 26rpx;
  position: reactive;
  z-index: 10;
  border: 1px solid transparent;
}
.discount-tag {
  background: $uni-color-primary;
  color: #fff;
  position: relative;
  font-size: 24rpx;
  margin-left: 40rpx;
  padding-right: 12rpx;
  border-radius: 0 12rpx 12rpx 0rpx;
  padding-left: -14rpx;
  height: 44rpx;
  display: flex;
  align-items: center;
  .tag {
    position: absolute;
    height: 100%;
    width: 36rpx;
    background: url('https://storage.szline9.com/frontend/static/public/sanjiao2.png') no-repeat;
    background-size: 100% 100%;
    left: -30rpx;
    z-index: 1;
  }
  .text {
    position: relative;
    z-index: 2;
    display: inline-block;
    margin-left: -12rpx;
  }
}

.badge {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  z-index: 10;
}

.attr-active,
.attr-next .attr-next-active {
  color: $uni-color-primary;
  border: 1px solid $uni-color-primary;
  background: rgba(249, 123, 145, 0.15);
  box-sizing: border-box;
}

.outofstock {
  position: absolute;
  background: #afafaf;
  font-size: 20rpx;
  top: -14rpx;
  right: -2rpx;
  border-radius: 0 12rpx 0rpx 12rpx;
  padding: 0 12rpx;
  color: #fff;
}

.buy-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
  /* box-sizing: border-box; */
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.12);
  height: 110rpx;
  z-index: 100;
}
.discount-box {
  width: 100%;
  align-items: center;
  background: #fff;
  // box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.12);
  // background: rgba($color: #fff, $alpha: 100);
}

.safe-area-inset-height {
  height: 110rpx;
}

.number-box {
  position: relative;
}

.cart-count {
  animation: jump 0.5s cubic-bezier(0.1, 0.7, 1, 0.1) infinite;
  animation-iteration-count: infinite;
}

@keyframes jump {
  0% {
    transform: translateY(1);
  }

  50% {
    transform: scale(1.4);
  }
}
.transparent {
  color: rgba($color: #fff, $alpha: 0.8);
}

.loading {
  position: absolute;
  /* left: 50%;
  top: 50%; */
  /* transform: translate(-50%, -50%); */
  background: rgba(0, 0, 0, 0);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;

  image {
    width: 80rpx;
    height: 80rpx;
  }
}
.sky-shop {
  position: sticky;
  position: -webkit-sticky;
  top: 0px;
  left: 0;
  background: #fff;
  z-index: 99;
}
</style>
