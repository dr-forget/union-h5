import { smallApp } from '../request';
const { post, get } = smallApp || {};

// 获取聊天记录
export const onGetUserHistory = (uid: string) => get(`/union/bot-ai/ai-info/${uid}`);
