// 获取元素高度
export const GetRect = (selector: string, instance?: any, all?: boolean): Promise<any> => {
  return new Promise((resolve) => {
    uni
      .createSelectorQuery()
      .in(instance)
      [all ? 'selectAll' : 'select'](selector)
      .boundingClientRect((rect) => {
        if (all && Array.isArray(rect) && rect.length) {
          resolve(rect);
        }
        if (!all && rect) {
          resolve(rect);
        }
        resolve(rect);
      })
      .exec();
  });
};
// 将rgb颜色转成hex  输入(24,12,255)

export const colorRGB2Hex = (r: number, g: number, b: number) => {
  let hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  return hex;
};
// 将hex颜色转成rgb
export const hexToRgba = (hex: string, opacity: number) => {
  let RGBA = 'rgba(' + parseInt('0x' + hex.slice(1, 3)) + ',' + parseInt('0x' + hex.slice(3, 5)) + ',' + parseInt('0x' + hex.slice(5, 7)) + ',' + opacity + ')';
  return {
    red: parseInt('0x' + hex.slice(1, 3)),
    green: parseInt('0x' + hex.slice(3, 5)),
    blue: parseInt('0x' + hex.slice(5, 7)),
    rgba: RGBA,
  };
};
//  rgba  rgb 格式转换
export const transColor = (color: any) => {
  const rgbaReg = /rgba/gi;

  const status = rgbaReg.test(color);
  if (status) {
    const colorstr = color.replace(rgbaReg, '');
    const colors = colorstr.substring(1, colorstr.length - 1).split(',');
    const rgbaObj: any = { red: 0, green: 0, blue: 0 };
    const objkeys = Object.keys(rgbaObj);
    colors.map((item: any, i: number) => {
      if (i == colors.length - 1) {
        rgbaObj.rgba = `rgba(${rgbaObj.red},${rgbaObj.green},${rgbaObj.blue},${~~item})`;
        rgbaObj.opcity = ~~item;
      } else {
        rgbaObj[objkeys[i]] = ~~item;
      }
    });
    return rgbaObj;
  } else {
    const colorstr = color.replace(rgbaReg, '');
    const colors = colorstr.substring(1, colorstr.length - 1).split(',');
    const rgbaObj: any = { red: 0, green: 0, blue: 0, opcity: 1 };
    const objkeys = Object.keys(rgbaObj);
    colors.map((item: any, i: any) => {
      rgbaObj[objkeys[i]] = ~~item;
    });
    return rgbaObj;
  }
};
export const colorRgba = (sHex: string, opcity?: number) => {
  // 十六进制颜色值的正则表达式
  let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{4}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8})$/;
  /* 16进制颜色转为RGB格式 */
  let sColor = sHex.toLowerCase();
  let alpha = 1;
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4 || sColor.length === 5) {
      let sColorNew = '#';
      for (let i = 1; i < sColor.length; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }
      sColor = sColorNew;
    }
    // 如果有透明度再执行
    if (sColor.length === 9) {
      alpha = Number((parseInt('0x' + sColor.slice(7, 9)) / 255).toFixed(2));
    }
    //  处理六位的颜色值
    let sColorChange: number[] = [];
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)));
    }
    const [red, green, blue] = sColorChange;
    const opcityTr = opcity || 0;
    return {
      red,
      green,
      blue,
      rgba: `rgba(${sColorChange.join(',')},${opcityTr.toString() ? opcity : alpha})`,
    };
  } else {
    return {
      red: 0,
      green: 0,
      blue: 0,
      rgba: '',
    };
  }
};
export function getQueryParam(url: string, key: string) {
  const index = url.search(/\?/gi);
  const paramStr = url.substring(index + 1) || '';
  const reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i');
  const r = paramStr.match(reg);
  if (r != null) {
    return decodeURI(r[2]);
  }
  return null;
}
export const formatMoney = (moneny: string): number => {
  let price = moneny;
  price = price.replace(/[^\d.]/g, ''); //清除“数字”和“.”以外的字符
  price = price.replace(/\.{2,}/g, '.'); //只保留第一个. 清除多余的
  price = price.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
  price = price.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
  if (price.indexOf('.') < 0 && price != '') {
    //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
    price = parseFloat(price).toFixed(2);
  }
  return Number(price);
};

export const getQuerys = (url?: string) => {
  const e = url || location.href;
  if (!e) return '';
  let t = {},
    r = [],
    n = '',
    a = '';
  try {
    let i: any = [];
    if ((e.indexOf('?') >= 0 && (i = e.substring(e.indexOf('?') + 1, e.length).split('&')), i.length > 0)) for (let o in i) (n = (r = i[o].split('='))[0]), (a = r[1]), (t[n] = a);
  } catch (s) {
    t = {};
  }
  return t;
};

// 数字转文字
export const numberToChinese = (num: number) => {
  const numberMap = new Map([
    [1, '一'],
    [2, '二'],
    [3, '三'],
    [4, '四'],
    [5, '五'],
    [6, '六'],
    [7, '七'],
    [8, '八'],
    [9, '九'],
    [10, '十'],
  ]);
  return numberMap.get(num) || '';
};

// 设置oss缓存时间 默认是10分钟
export const get_oss_Cache_timer = (field: string, time = 10): number => {
  const start_request = uni.getStorageSync(field) || +new Date();
  // 5分钟内不重复请求
  let timerstart = +new Date();
  if (+new Date() - start_request <= time * 60 * 1000) {
    timerstart = start_request;
    uni.setStorageSync(field, timerstart);
    return timerstart;
  }
  uni.setStorageSync(field, timerstart);
  return timerstart;
};

// 测试
export const onUnload = (fn) => {
  console.log(fn, 200);
  fn && fn();
};

// 识别文本中的手机号

export const parseStr = (str) => {
  const regPhone = /(\d{3}-\d{8}|\d{4}-\d{7})|(\d{11})/g;
  const list = str.split(regPhone)?.filter((c) => Boolean(c));
  return list.map((c) => {
    let tag;
    regPhone.test(c) ? (tag = 'phone') : (tag = 'text');
    return {
      type: tag,
      text: c || '',
    };
  });
};

// 比较两个版本号
export const compareVersion = (v1, v2) => {
  v1 = v1.split('.');
  v2 = v2.split('.');
  const len = Math.max(v1.length, v2.length);

  while (v1.length < len) {
    v1.push('0');
  }
  while (v2.length < len) {
    v2.push('0');
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i]);
    const num2 = parseInt(v2[i]);

    if (num1 > num2) {
      return 1;
    } else if (num1 < num2) {
      return -1;
    }
  }

  return 0;
};
// 简易版将对象转成query
export const objtoQuery = (obj: any) => {
  return Object.keys(obj)
    .map((key) => {
      return `${key}=${obj[key]}`;
    })
    .join('&');
};

// 拓展数组filter方法 返回符合条件下标的数组
export const filterIndex = (arr: any[], fn: Function) => {
  let res: number[] = [];
  arr.map((item, index) => {
    if (fn(item, index)) {
      res.push(index);
    }
  });
  return res;
};

// 给定一个数组 和 一个数组中的下标集合 删除下标集合中的元素 并返回新数组 和删除的元素
export const removeArrIndex = (arr: any[], indexs: number[]) => {
  let res: any[] = [];
  let newArr = arr.filter((item, index) => {
    if (indexs.includes(index)) {
      res.push(item);
      return false;
    }
    return true;
  });
  return [newArr, res];
};

export const IsweChat = () => {
  // #ifdef H5
  const ua = navigator.userAgent.toLowerCase();
  //通过正则表达式匹配ua中是否含有MicroMessenger字符串
  if (ua.match(/MicroMessenger/i)?.[0] == 'micromessenger') {
    return true;
  } else {
    return false;
  }
  // #endif

  // #ifndef H5
  return false;
  // #endif
};

export const page_sgin = async () => {
  const baseUrl = uni.getStorageSync('baseUrl');
  const result: any = await uni.request({
    url: baseUrl + 'shop-api/distribution/user/js-sign',
    method: 'POST',
    data: {
      url: window.location.href,
    },
  });
  const res = result.data.data;
  // @ts-ignore
  jWeixin.config({
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: 'wx9ef482a7be656ff5', // 必填，公众号的唯一标识
    timestamp: res.time, // 必填，生成签名的时间戳
    nonceStr: res.noncestr, // 必填，生成签名的随机串
    signature: res.sign, // 必填，签名
    jsApiList: ['hideAllNonBaseMenuItem'], // 必填，需要使用的JS接口列表
    openTagList: [''],
  });
  // @ts-ignore
  jWeixin.ready(function () {
    console.log('ready');
    // @ts-ignore
    jWeixin.hideAllNonBaseMenuItem();
  });
  // @ts-ignore
  jWeixin.error(function (res: any) {
    console.log('error', res);
  });
};

export function objectToQueryString(obj, prefix?: string) {
  const str: any = [];
  for (const [key, value] of Object.entries(obj)) {
    const encodedKey = prefix ? `${prefix}[${encodeURIComponent(key)}]` : encodeURIComponent(key);
    if (typeof value === 'object' && value !== null) {
      str.push(objectToQueryString(value, encodedKey));
    } else {
      // @ts-ignore
      str.push(`${encodedKey}=${encodeURIComponent(value)}`);
    }
  }
  return str.join('&');
}
// 去除URL中code参数
export function removeCodeFromUrl() {
  const params: any = getQuerys();
  if (params.code) {
    delete params.code;
    const url_params = objectToQueryString(params);
    const url = `${location.origin}${location.pathname}${url_params ? `?${url_params}` : ''}`;
    return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9ef482a7be656ff5&redirect_uri=${encodeURIComponent(url)}&response_type=code&scope=snsapi_base#wechat_redirect`;
  }
  return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9ef482a7be656ff5&redirect_uri=${encodeURIComponent(window.location.href)}&response_type=code&scope=snsapi_base#wechat_redirect`;
}
