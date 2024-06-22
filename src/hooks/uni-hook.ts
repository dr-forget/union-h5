import { smallApp } from '@/api/request';
const Objtoquery = (obj: any) => {
  let str = '';
  for (let i in obj) {
    str += `${i}=${obj[i]}&`;
  }
  return str.substring(0, str.length - 1);
};
export default function lineHook() {
  const router = {
    to: (url: string, Params?: Object) => {
      const str = Params ? Objtoquery(Params) : '';
      const tourl = `${url}${str ? `?${str}` : ''}`;
      isAuth(tourl) &&
        uni.navigateTo({
          url: tourl,
          fail: (res) => {
            console.log(res, 16);
          },
        });
    },
    back: async (delta?: number) => {
      return new Promise((relove, reject) => {
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1];
        if (pages.length > 1) {
          uni.navigateBack({
            delta: delta || 1,
            success: (res) => {
              smallApp.removePeddingRequest('', currentPage.route);
              relove(true);
            },
            fail: (res) => {
              reject(res);
            },
          });
        } else {
          router.switchTab('/pages/index/index');
        }
      });
    },
    rectTo: (url: string, Params?: Object) => {
      const [, currentPage] = getprevPage();
      const str = Params ? Objtoquery(Params) : '';
      const tourl = `${url}${str ? `?${str}` : ''}`;
      isAuth(url) &&
        uni.redirectTo({
          url: tourl,
          success() {
            smallApp.removePeddingRequest('', currentPage.route);
          },
        });
    },
    reLaunch: (url: string) => {
      const [, currentPage] = getprevPage();
      isAuth(url) &&
        uni.reLaunch({
          url,
          success() {
            smallApp.removePeddingRequest('', currentPage.route);
          },
        });
    },
    switchTab: (url: string) => {
      isAuth(url) && uni.switchTab({ url });
    },
  };
  const isAuth = (url: string) => {
    const reg = /-auth/gi;
    if (reg.test(url)) {
      router.to('/pages/login/login');
      return false;
    } else {
      return true;
    }
  };
  const getprevPage = () => {
    const pages = getCurrentPages();
    const currPage = pages[pages.length - 1]; // 当前页面
    const prevPage = pages[pages.length - 2]; // 上一
    return [prevPage, currPage];
  };
  const prevPageonLoad = (isdeay?: number, fn?: (key: any) => void) => {
    const [prepage] = getprevPage();
    fn?.(prepage);
    if (isdeay) {
      setTimeout(() => {
        //@ts-ignore
        prepage.onLoad?.(prepage.options || {});
        router.back();
      }, isdeay);
    } else {
      //@ts-ignore
      prepage.onLoad?.(prepage.options || {});
      router.back();
    }
  };
  const Toast = (title: string) => {
    uni.showToast({
      title,
      icon: 'none',
      duration: 3000,
    });
  };
  const saveImageToAlbum = (imagePath: string) => {
    uni.saveImageToPhotosAlbum({
      filePath: imagePath,
      success: () => {
        uni.showToast({
          title: '保存成功',
          icon: 'none',
        });
      },
      fail: () => {
        uni.showToast({
          title: '保存失败',
          icon: 'none',
        });
      },
    });
  };
  const saveImage = (imagePath: string) => {
    // #ifndef H5
    uni.showLoading({
      title: '正在下载...',
      mask: true,
    });
    // saveImageToAlbum(imagePath);

    uni.getSetting({
      success(get_res) {
        if (!get_res.authSetting['scope.writePhotosAlbum']) {
          uni.authorize({
            scope: 'scope.writePhotosAlbum',
            success(auth) {
              try {
                // @ts-ignore
                uni.hideLoading({ noConflict: true });
              } catch (e) {}
              saveImageToAlbum(imagePath);
            },
            fail(err) {
              console.log(err, 116);
              try {
                // @ts-ignore
                uni.hideLoading({ noConflict: true });
              } catch (e) {}
              uni.showModal({
                title: '提示',
                content: '您未进行手机相册授权，图片将不能保存，是否重新授权',
                success(bres) {
                  if (bres.confirm) {
                    uni.openSetting({
                      success(bres) {
                        try {
                          // @ts-ignore
                          uni.hideLoading({ noConflict: true });
                        } catch (e) {}
                        saveImageToAlbum(imagePath);
                      },
                    });
                  } else if (bres.cancel) {
                  }
                },
              });
            },
          });
        } else {
          try {
            // @ts-ignore
            uni.hideLoading({ noConflict: true });
          } catch (e) {}
          saveImageToAlbum(imagePath);
        }
      },
    });
    // #endif
    // #ifdef H5

    Toast('网页版请长按图片即可保存');
    // #endif
  };
  // 删除临时文件
  // 获取临时文件
  const onGetTemplateFile = (): Promise<string[]> => {
    const fs = uni.getFileSystemManager();
    return new Promise((resolve, reject) => {
      fs.readdir({
        // #ifdef MP-WEIXIN
        // @ts-ignore
        dirPath: `${wx.env.USER_DATA_PATH}`,
        // #endif
        success(res) {
          const files = res.files.filter((item) => item !== 'miniprogramLog');
          resolve(files);
        },
        fail(res) {
          reject(res);
        },
      });
    });
  };
  // 删除临时文件
  const removeTempFile = async () => {
    // #ifdef MP
    const tempFiles = await onGetTemplateFile();
    const fs = uni.getFileSystemManager();
    const removefiles: string[] = [];
    for (let i = 0; i < tempFiles.length; i++) {
      const item = tempFiles[i];
      // @ts-ignore
      const fileurl = `${wx.env.USER_DATA_PATH}/${item}`;
      // 此文件为小程序log 文件 没有权限删除
      if (item !== 'miniprogramLog') {
        removefiles.push(fileurl);
        fs.unlinkSync(fileurl);
      }
    }
    return removefiles;
    // #endif
  };
  const showModal = (data: UniNamespace.ShowModalOptions) => {
    return uni.showModal({
      confirmColor: '#F62349',
      cancelColor: '#666',
      ...data,
    });
  };
  return { router, getprevPage, isAuth, Toast, prevPageonLoad, saveImage, removeTempFile, onGetTemplateFile, showModal };
}
