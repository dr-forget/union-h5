<template>
  <view v-if="state.cover_goods.length || state.status == 'loading'" class="mx-20">
    <view v-if="state.cover_goods.length" class="flex items-center flex-center mb-24">
      <image :src="props.icon" style="width: 40rpx; height: 40rpx" />
      <text class="c-666 ml-8">{{ props.title }}</text>
    </view>
    <waterfall v-model="state.cover_goods">
      <template #left="{ item }">
        <view class="mb-20">
          <vt-shop-card
            :image="item.goods_spu_image"
            :title="item.goods_spu_title"
            :price="item.goods_sku_price"
            :sales="item.sales"
            :stock="item.stock"
            :commission="item.commission"
            :is_subsidy="item.is_subsidy"
            :shop_postion="item.goods_position"
            :tag_list="item.discount_tag"
            :subsidy_commission="item.subsidy_commission"
            :source="item.goods_spu_source"
            :begin_time="item.begin_time"
            @click="to_Details(item.goods_spu_id)"
          >
          </vt-shop-card>
        </view>
      </template>
    </waterfall>
    <load-more v-if="state.status == 'loading'" status="loading"></load-more>
  </view>
</template>
<script setup lang="ts">
import useState from '@/hooks/useState';
import lineHook from '@/hooks/uni-hook';
import { killActivityList } from '@/api/shop';
import { onMounted } from 'vue';
interface isProps {
  title?: string;
  position: number | string;
  icon?: string;
  start?: boolean; //初始化数据
}

interface isState {
  cover_goods: killListRow[];
  status: LoadingStatus;
}

const props = withDefaults(defineProps<isProps>(), {
  icon: 'https://storage.szline9.com/frontend/static/svg/zan.svg',
  position: 1,
  title: '为您推荐',
  start: true,
});

const emit = defineEmits(['nodata']);

const { state } = useState<isState>({
  cover_goods: [],
  status: props.start ? 'loading' : 'nomore',
});

const { router } = lineHook();

const to_Details = (id: number | string) => {
  router.to('/pages/shop-details/shop-details?id=' + id);
};

const onGetcollectionShopList = async () => {
  state.status = 'loading';
  const res = await killActivityList({ position: props.position });
  state.cover_goods = res.goods;
  state.status = 'nomore';
  emit('nodata', !res.goods.length);
};

onMounted(() => {
  props.start && onGetcollectionShopList();
});

defineExpose({
  onGetcollectionShopList,
});
</script>
