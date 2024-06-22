<template>
  <view class="content">
    <view v-for="(item, i) in state.history" :key="i">
      <view class="user-chat" v-if="item.role !== 'user'">
        <image src="https://storage.szline9.com/frontend/static/public/cu-avatar2cf86166.png" mode="aspectFill" class="avatar" />
        <view class="chat-content">
          <uaMarkdown :source="item.content" :showLine="false"></uaMarkdown>
        </view>
      </view>
      <view class="user-chat flex-end" v-else>
        <view class="chat-content user-bg" :style="{ marginLeft: 0 }">
          <uaMarkdown :source="item.content" :showLine="false"></uaMarkdown>
          <!-- {{ item.content }} -->
        </view>
        <image :src="state.user_header_url || 'https://storage.szline9.com/frontend/static/public/cu-avatar2cf86166.png'" mode="aspectFill" class="avatar" style="margin-left: 12rpx" />
      </view>
    </view>

    <view class="print-input safe-area-inset-bottom">
      <input type="text" placeholder="请输入Message" v-model="state.content" />
      <div class="send_btn" @click="sendContent">
        <image :src="state.socket ? '/static/stop.svg' : '/static/send.svg'" mode="aspectFill" class="image-send" />
      </div>
    </view>
    <view class="safe-area-inset-bottom"></view>
    <view style="height: 120rpx"></view>
  </view>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { onGetUserHistory } from '@/api/ai';
import uaMarkdown from './ua-markdown/ua-markdown.vue';
const state = reactive<any>({
  socket: null,
  history: [],
  content: '',
  user_header_url: '',
  ws_id: '',
  tempcontent: '', //临时组装内容
  host: 'debian.hhshsq.cn:9702',
});

const onLoadInfo = async (id: string) => {
  const res: any = await onGetUserHistory(id);
  console.log(res, 47);
  state.history = res.history;
  if (res.history.length <= 1) {
    createWebsocket();
  }
};

const sendContent = () => {
  if (!state.ws_id) {
    uni.showToast({
      title: '会话不存在',
      icon: 'none',
    });
    return;
  }
  if (!state.content) {
    uni.showToast({
      title: '请输入内容',
      icon: 'none',
    });
    return;
  }
  if (state.socket) {
    state.socket.close();
  } else {
    const user = { role: 'user', content: state.content };
    state.history.push(user);
    state.content = '';
    createWebsocket();
    uni.pageScrollTo({ scrollTop: 99999, duration: 0 });
  }
};

const createWebsocket = async () => {
  const socket = uni.connectSocket({
    url: `ws://${state.host}/fly-spark?id=${state.ws_id}`,
    success: (res) => {
      console.log('connectSocket success', res);
    },
  });
  state.socket = socket;
  socket.onOpen(() => {
    console.log('WebSocket连接已打开！');
    socket.send({ data: JSON.stringify({ event: 'message', data: state.history.slice(-6) }) });
  });
  socket.onMessage((res) => {
    uni.pageScrollTo({ scrollTop: 99999, duration: 0 });
    const result = JSON.parse(res.data);
    // 不等于0表示有错误
    if (result.header.code !== 0) {
      socket.close({
        success: () => {
          console.log('close success');
        },
      });
      return;
    }
    let contents = result.header.code !== 0 ? result.header.message : result.payload.choices.text; //可能有多条回复
    for (let i = 0; i < contents.length; i++) {
      const text = contents[i].content; //单条内容
      state.tempcontent = state.tempcontent + text;
    }
    if (result.header.code === 0 && result.header.status === 0) {
      state.history.push({
        role: 'assistant',
        content: state.tempcontent,
      });
    } else {
      const last_content = state.history[state.history.length - 1];
      for (let i = 0; i < contents.length; i++) {
        last_content.content += contents[i].content;
        uni.pageScrollTo({ scrollTop: 99999, duration: 0 });
      }
    }
  });
  socket.onError((res) => {
    console.log('WebSocket连接打开失败，请检查！');
  });
  socket.onClose((res) => {
    state.tempcontent = '';
    console.log('WebSocket 已关闭！', res);
    if (res.code == 1001) {
      uni.showToast({
        title: res.reason,
        icon: 'none',
      });
    }
    state.socket = null;
  });
};

onLoad((res: any) => {
  state.ws_id = res.m;
  if (res.env == 'dev') {
    state.host = 'debian.hhshsq.cn:9701';
  }
  if (res.m) {
    onLoadInfo(res.m);
  }
});
</script>

<style>
.content {
  padding: 0 24rpx;
}
.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50rpx;
  display: inline-block;
  flex-shrink: 0;
}
.user-chat {
  display: flex;
  align-items: end;
}
.flex-end {
  justify-content: flex-end;
}
.chat-svg {
  /* border: 1px solid red; */
  position: absolute;
  bottom: 0;
  left: -20rpx;
  width: 20rpx;
}
.chat-content {
  background: #212121;
  color: #fff;
  padding: 20rpx;
  border-radius: 20rpx 20rpx 20rpx 20rpx;
  margin-top: 20rpx;
  color: #fff;
  display: inline-block;
  margin-left: 12rpx;
  box-shadow: 0 1px 2px rgb(16, 16, 16, 0.612);
  font-size: 26rpx;
  position: relative;
  width: fit-content;
  max-width: calc(100vw - 188rpx);
}
.image-send {
  transition: all 0.3s;
}

page {
  background: rgba(0, 0, 0, 0.8);
  min-height: 100vh;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
}

.user-bg {
  background: rgb(118, 106, 200) !important;
}
page::before {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background: rgba(0, 0, 0, 0.8);
  background: url('/static/bg.png');
  background-size: 1020rpx auto;
}
.print-input {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100rpx;
  border-top: 1px solid #212121;
  display: flex;
  align-items: center;
  padding: 0 24rpx;
  box-sizing: border-box;
  color: #fff;
  z-index: 999;

  input {
    background: #212121;
    width: 100%;
    height: 80rpx;
    border-radius: 50rpx;
    padding: 0 24rpx;
  }
}
.send_btn {
  width: 140rpx;
  flex-shrink: 0;
  height: 70rpx;
  margin-left: 24rpx;
  background: #edf1ff linear-gradient(227deg, #6831ff, #465cff);
  box-shadow: 0 4px 6px 0 rgba(67, 104, 160, 0.13);
  border-radius: 50rpx;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  image {
    width: 44rpx;
    height: 44rpx;
  }
  /* height: 80rpx; */
}
</style>
