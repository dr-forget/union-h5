import useState from '@/hooks/useState';
import { GetRect } from '@/utils/tool';
import { onMounted, watch, getCurrentInstance, defineEmits } from 'vue';

interface Istate {
  tabList: CustomTabItem[];
  currentIndex: number;
  isShowLine?: boolean;
  scrollable?: boolean;
  activeColor?: string;
  background?: string;
  scrollboxWidth: number;
  scrollLeft: number;
  lineWidth: number;
  itemnodes: any[];
  lineOffsetLeft: number;
  isFirst: boolean;
  sortIcon: string;
  showDropList: boolean;
  isAnimate: boolean;
  // sortIconAdd: string;
  // sortIconDesc: string;
}

const sortIcon =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAwklEQVRIS+2VQQrCMBBFf7OsN9FdGHod68ms15Ehu3oTXQYJVCihkxnRwY3dtvyX/NdMOjg/nXM+3gIw87EsiIgu1oWZASmlfc75WoJDCEOM8WaBmADM3AMo4YcldAYwENFDg1gBZwBjFTYR0eljwNL7JASNmo/mDla97wTAXfMhAjZ6l9po+mgBtnqXIKIPk2RNZOv9H6C29zvJ7r9p2bvrQXuV6zoqVhC/YVcg7uO68vH9C6fy4XNlqidK+MB9Fj0B/r9gGaRptScAAAAASUVORK5CYII=';
const sortIconAdd =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABFklEQVRIS+2VQU7DMBBFn9NdOUGBE5RdNMp1KCdruE5lZVduAD0B7JqgaYsUBY/HDeoObxPPs9/PTAI3XuHG9bkKcIBnPdAKXksPVgw4wPoIOy28gGYFbyWQIsAHLAfYDfCkRQPsAzT38OVBigDvsB1gMynWPsLLnwHq/QhtqtACNl4e2RuMvN8ZJ/308jABU++WCi8PE2B4T3ICtA9GHkUhe0Hmnv8DXHumohjjlt/NZRVsRSTZdDnAkvPsOY2HzNoDjYgkx0Y25K7r1n3fK8RstKqqmrquzcHnfkUxRh3RyVGhCkUkO7pdgKox8jC9j3WWAqZ5ZL1fDdANozzwvM8CXFSdfpme99kAt6sSLxRlMKfwz55vVKZTGQsG0t4AAAAASUVORK5CYII=';
const sortIconDesc =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABEUlEQVRIS+2VQW7CMBBFn8MOTgDcgO6iUa5DOBnpdZCVHb1BywnojgS5DWpEPR6Til2zTfyf8348cTz5ck/O5yGA934bNiQir7kbywa0bbvpuu4QgouiqMqyfMuBZAG893MghL8MoUegEpFPC5IL2AP1XVgjIrs/AwbvjRJUW30k32DkfaEAzlYfKiDiXbOR7CMFiHnXIGofWSVbRabu/wNMe6qid9j3vw9XNNBBs4booVMBHzDv4dD/jAct/OigWkF0bCRLPsHm8j2D1IM2g2oJ6uAzv6ITbC8QHRUzqJeQHN0mIHiJ9ZHyPnaZBbjvw0HS+8OAsGDUB5b3SYAB8vXLtLxPBpinKvJAVgdTgm9rriN5UxnF/JRvAAAAAElFTkSuQmCC';

export default function useHookData(props: any, emit: any) {
  const instance = getCurrentInstance();

  const { state, setData } = useState<Istate>({
    tabList: props.tabList,
    scrollboxWidth: 0,
    scrollLeft: 0,
    itemnodes: [],
    currentIndex: props.currentIndex,
    lineWidth: 0,
    lineOffsetLeft: 0,
    isFirst: true,
    sortIcon,
    isAnimate: false,
    background: props.background,
    showDropList: props.showDropList,
  });

  const allNodes = async (isForce?: boolean) => {
    if (!state.itemnodes.length || isForce) {
      state.itemnodes = await GetRect('.scroll-tab-item', instance, true);
    }
  };

  const setLineLeft = async () => {
    await allNodes();
    const tabItem = state.itemnodes[state.currentIndex];
    let lineOffsetLeft = state.itemnodes.slice(0, state.currentIndex).reduce((total, curr) => total + curr.width, 0);
    const lineWidth = props.scrollable ? tabItem.width - 36 : 20;
    state.lineWidth = lineWidth;
    state.lineOffsetLeft = lineOffsetLeft + (tabItem.width - lineWidth) / 2;
    state.isFirst = false;
  };

  const scrollIntoView = async () => {
    // 如果存在节点 不再查询
    await allNodes();

    const tabRect = state.itemnodes[state.currentIndex];

    const offsetLeft = state.itemnodes.slice(0, state.currentIndex).reduce((prev, curr) => prev + curr.width, 0);

    const left = offsetLeft - (state.scrollboxWidth - tabRect.width) / 2;
    state.scrollLeft = left;
  };

  const tabItemClick = async (index) => {
    if (!state.tabList.length) return;
    if (index == state.currentIndex && !state.isFirst) return;
    // 记录一下上一个tab
    const preTabitem = state.tabList[state.currentIndex];

    if (state.currentIndex !== index || state.isFirst) {
      state.currentIndex = index;
      // 如果激活是切换图片
      const currtTabitem = state.tabList[index];

      if (currtTabitem?.tagImage && currtTabitem?.activeImage) {
        currtTabitem.originTagImage = currtTabitem.tagImage;
        currtTabitem.tagImage = currtTabitem.activeImage;
      }
      if (preTabitem?.originTagImage && !state.isFirst) {
        preTabitem.tagImage = preTabitem.originTagImage;
      }

      if (props.scrollable) {
        await scrollIntoView();
      }
    }

    if (state.isFirst && props.isShowLine) {
      setLineLeft();
    }
    const tabItem = state.tabList[state.currentIndex];

    if (tabItem.sort_options) {
      state.tabList
        .filter((item) => item.sort_options && item.key != tabItem.key)
        .map((item) => {
          item.value = '';
          item.sortIcon = '';
        });

      const value = tabItem.sort_options[tabItem.sort_options.length - 1].value;

      tabItem.value == value ? (tabItem.value = tabItem.sort_options[0].value) : (tabItem.value = value);

      tabItem.sortIcon = tabItem.value == value ? sortIconAdd : sortIconDesc;
    } else {
      state.tabList
        .filter((item) => item.sort_options)
        .map((item) => {
          item.value = '';
          item.sortIcon = '';
        });
    }
    !state.isFirst && emit('change', { key: tabItem.key, value: tabItem.value });
    state.isFirst = false;
  };
  return { state, setData, allNodes, instance, emit, tabItemClick };
}
