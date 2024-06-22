import lineHook from '@/hooks/uni-hook';
import { ResponseCode } from './enum';
import { getQuerys, IsweChat, removeCodeFromUrl } from '@/utils/tool';
interface ConfigProps {
  baseUrl: string;
  timeout?: number;
}
type ResponseType<T> = {
  code: number;
  data: T;
  msg: string;
  traceId: string;
  clientIp: string;
};
class Http {
  private static instance: Http | null = null;
  private baseUrl: string;
  private timeout: number;
  private instance: UniApp.RequestTask | null;
  private uploadinstance: UniApp.UploadTask | null;
  noAuthRequest: string[];
  peddingRequest: any[];
  requestQueue: any[];
  isFetchToken: boolean;
  islogin: boolean;
  constructor(config: ConfigProps) {
    this.timeout = config.timeout || 40000;
    this.baseUrl = config.baseUrl;
    this.instance = null;
    this.uploadinstance = null; //上传实例
    this.noAuthRequest = [];
    this.peddingRequest = [];
    this.requestQueue = [];
    this.isFetchToken = false;
    this.islogin = false; //是否发送过登录请求
  }
  private onRequest = async <T>(method: UniApp.RequestOptions['method'], url: string, data?: string | AnyObject | ArrayBuffer, isAbort?: boolean): Promise<T> => {
    const config = await this.requestInterception({
      url,
      method,
      data,
      header: {},
    });
    if (!config) {
      return new Promise((resolve, reject) => {
        this.requestQueue.push({ url, method, data, isAbort, resolve, reject });
      });
      throw new Error('拦截器取消请求');
    }
    return new Promise((resolve, reject) => {
      const reg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
      const request_url = reg.test(url) ? url : this.baseUrl + url;
      const requestKey = this.ongetuniRequesturl(url, method, data, isAbort);
      // 微信检测登录用
      if (url == 'local/checklogin') {
        // @ts-ignore
        resolve({ code: 0 });
        return;
      }
      this.instance = uni.request({
        url: request_url,
        method,
        data,
        timeout: this.timeout,
        header: config.header,
        success: (res) => {
          this.removePeddingRequest(requestKey);
          resolve(this.responseSuccess<T>(res, reject, config));
        },
        fail: (error) => {
          this.removePeddingRequest(requestKey);
          reject(this.responseError(error, config));
        },
      });
      this.peddingRequest.push({
        key: requestKey,
        instance: this.instance,
      });
    });
  };
  private ongetuniRequesturl = (url: string, method: UniApp.RequestOptions['method'], data, isAbort) => {
    const { getprevPage } = lineHook();
    const [, curretPage] = getprevPage();
    return `${curretPage?.route ? curretPage?.route + '#' : ''}${url}${method}${JSON.stringify(data || '')}${!isAbort ? 'isAboutKey' : ''}`;
  };
  public removePeddingRequest = (key: string, routerName?: string) => {
    // 路由变更 全部当前路由未发送完的理由
    if (routerName) {
      for (let i = 0; i < this.peddingRequest.length; i++) {
        const item = this.peddingRequest[i];
        if (item.key.indexOf(routerName) > -1) {
          // isAboutKey 有关键字不取消请求
          item.key.indexOf('isAboutKey') > -1 ? null : item.instance.abort();
          this.peddingRequest.splice(i, 1);
          i--;
        }
      }
      return;
    }
    for (let i = 0; i < this.peddingRequest.length; i++) {
      const item = this.peddingRequest[i];
      if (item.key == key) {
        this.peddingRequest.splice(i, 1);
        break;
      }
    }
  };
  private uploadFile = async <T>(url: string, files: string, formData?: any, callback?: (e: UniApp.OnProgressUpdateResult) => void): Promise<T> => {
    const config = await this.requestInterception({ url, files, header: {} });
    console.log(config, 152);
    if (!config) {
      throw new Error('拦截器取消请求');
    }
    return new Promise((resolve, reject) => {
      const reg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
      this.uploadinstance = uni.uploadFile({
        url: reg.test(url) ? url : this.baseUrl + url,
        timeout: this.timeout,
        header: config.header,
        filePath: files,
        name: 'file',
        formData: formData || undefined,
        success: (res) => {
          res.data = JSON.parse(res.data);
          resolve(this.responseSuccess<T>(res, reject, config));
        },
        fail: (error) => {
          reject(this.responseError(error, config));
        },
      });
      this.uploadinstance?.onProgressUpdate((res) => {
        callback && callback(res);
      });
    });
  };
  //  请求拦截器
  private requestInterception = async (config: any = {}) => {
    config.header['is_proxy'] = uni.getStorageSync('is_proxy') || 2;
    return config;
  };
  //   响应拦截器 响应成功
  private responseSuccess = <T>(response: UniApp.RequestSuccessCallbackResult | UniApp.UploadFileSuccessCallbackResult, reject: (data: any) => void, configParams?: any): T => {
    const data = response.data as ResponseType<T>;
    if (ResponseCode.SUCCESS == data.code) {
      if (configParams.header.token || this.noAuthRequest.length) {
        this.noAuthRequest = [];
      }
      return data.data;
    }
    const httpCodestr: string = this.httpResCode(response.statusCode, data.msg);
    const errobj = [
      {
        requrl: this.baseUrl + configParams.url,
        methods: configParams.method,
        params: configParams.data,
        response: data.data,
        traceid: data.traceId,
        // @ts-ignore
        httpCodestr: httpCodestr || data.msg,
        reason: '请求出错',
      },
    ];
    if (httpCodestr) {
      uni.showToast({
        title: httpCodestr,
        icon: 'none',
        duration: 3000,
      });
    } else {
      uni.showToast({
        title: data.msg,
        icon: 'none',
        duration: 3000,
      });
    }
    reject(JSON.stringify(errobj[0]));
    return data.data;
  };
  //   响应失败
  private responseError = (error: UniApp.GeneralCallbackResult | any, config: any) => {
    const { data, url, method } = config;

    const obj = {
      error,
      data,
      url: this.baseUrl + url,
      method,
      message: 'response Error',
    };
    if (error.errMsg == 'request:fail timeout' || error?.errno == 5) {
      uni.showToast({
        title: '您的网络似乎不太畅通,建议您更换更优网络',
        icon: 'none',
        duration: 4000,
      });
      return obj;
    }
    if (error.errMsg !== 'request:fail abort') {
      uni.showToast({
        title: '服务器连接异常',
        icon: 'none',
        duration: 3000,
      });
    }
    return obj;
  };
  //  get请求
  public get = async <T>(url: string, data?: string | AnyObject | ArrayBuffer): Promise<T> => this.onRequest('GET', url, data);
  //   post 请求
  public post = async <T>(url: string, data?: string | AnyObject | ArrayBuffer, isAbort = true): Promise<T> => this.onRequest<T>('POST', url, data, isAbort);
  // 上传
  public upload = async <T>(url: string, files: string, formData?: any, callback?: (e: UniApp.OnProgressUpdateResult) => void) => this.uploadFile<T>(url, files, formData, callback);
  // 获取当前uniTask
  public getInstance = () => this.instance;
  // http code码拦截
  public httpResCode = (code: number, msg?: string) => {
    switch (code) {
      case 404:
        return 'api不存在';
      case 401:
        return '登录已失效';
      case 422:
        return msg || '';
      case 500:
        return 'api异常报错,请联系管理员';
      default:
        return '';
    }
  };
  public static getInstance(config: ConfigProps): Http {
    if (!Http.instance) {
      Http.instance = new Http(config);
    }
    return Http.instance;
  }
}
export const run = () => {
  const host = uni.getStorageSync('host');
  return Http.getInstance({ baseUrl: host });
};
// 调用第三方api请求方式,
export const request = async <T>(url: string, method: UniApp.RequestOptions['method'] = 'GET', data?: any): Promise<T> => {
  return new Promise((resole, rej) => {
    uni.request({
      url: url,
      method,
      data,
      success(res: any) {
        resole(res.data);
      },
      fail(res) {
        rej(res);
      },
    });
  });
};

export const smallApp = run();
