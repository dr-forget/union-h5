const copy = (data: string) => {
  uni.setClipboardData({
    data: data || '',
  });
};
const ossCdnImage = (url: string, w: number, suffix?: boolean) => {
  if (!url) return '';
  if (url?.indexOf('aikucun.com') > -1) {
    return suffix ? `?x-oss-process=image/resize,w_${w}/quality,q_100/interlace,1/quality,q_80` : `${url}?x-oss-process=image/resize,w_${w}/quality,q_100/interlace,1/quality,q_80`;
  }
  if (url?.indexOf('storage.szline9.com') > -1) {
    return suffix ? `?imageMogr2/auto-orient/thumbnail/${w}x/blur/1x0/interlace/1/quality/100|imageslim` : `${url}?imageMogr2/auto-orient/thumbnail/${w}x/blur/1x0/interlace/1/quality/100|imageslim`;
  }
  return suffix ? `?x-oss-process=image/resize,w_${w}/quality,q_100/interlace,1` : `${url}?x-oss-process=image/resize,w_${w}/quality,q_100/interlace,1`;
};

// 金额格式化
const formatMoney = (number: number | string, decimal = 2, split = '') => {
  // 将数字字符转换为数字
  const num = +number;
  /*
      parameter：
      num：格式化目标数字
      decimal：保留几位小数，默认2位
      split：千分位分隔符，默认为,
      moneyFormat(123456789.87654321, 2, ',') // 123,456,789.88
  */
  function thousandFormat(num: string): any {
    const len = num.length;
    return len <= 3 ? num : thousandFormat(num.substr(0, len - 3)) + split + num.substr(len - 3, 3);
  }
  if (isFinite(num)) {
    // num是数字
    if (num === 0) {
      // 为0
      return num.toFixed(decimal);
    } else {
      // 非0
      var res = '';
      var dotIndex = String(num).indexOf('.');
      if (dotIndex === -1) {
        // 整数
        res = thousandFormat(String(num)) + '.' + '0'.repeat(decimal);
      } else {
        // 非整数
        // js四舍五入 Math.round()：正数时4舍5入，负数时5舍6入
        // Math.round(1.5) = 2
        // Math.round(-1.5) = -1
        // Math.round(-1.6) = -2
        // 保留decimals位小数
        const numStr = String((Math.round(num * Math.pow(10, decimal)) / Math.pow(10, decimal)).toFixed(decimal)); // 四舍五入，然后固定保留2位小数
        const decimals = numStr.slice(dotIndex, dotIndex + decimal + 1); // 截取小数位
        res = thousandFormat(numStr.slice(0, dotIndex)) + decimals;
      }
      return res;
    }
  } else {
    return '--';
  }
};
/**
 * 字符串加星处理
 * @param str 需要处理的字符串
 * @param index  开始加星起始位置
 * @param end  结束位置 默认最后一位
 * @returns string
 */
const strStarding = (str: string, start: number, end?: number): string => {
  let entstr = '';
  const endStrIndex = end || str.length;
  for (let i = 0; i < str.length; i++) {
    if (i > start - 1 && i < endStrIndex) {
      entstr += '*';
    } else {
      entstr += str[i];
    }
  }
  return entstr;
};
// 睡眠函数
/**
 * 睡眠函数
 * @param timer 睡眠时间
 * @param cb 回调函数
 * @returns Promise
 * @example
 * await sleep(1000, () => {
 * console.log('睡眠1秒');
 * });
 * console.log('睡眠结束');
 * */
const sleep = (timer: number, cb?: () => void) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      cb && cb();
      resolve('');
    }, timer);
  });
};

export default {
  copy,
  ossCdnImage,
  formatMoney,
  strStarding,
  sleep,
};
