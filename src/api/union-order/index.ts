import { smallApp } from '../request';
const { post, get } = smallApp || {};

// 获取用户统计
export const onGetCommission = (uid: string) => get(`/union/union-order/personal-profit/${uid}`);

// 获取用户订单
export const onGetUserOrderList = (uid, data) => post<H5UniOrderList>(`/union/union-order/personal-order/${uid}`, data);

// 获取邀请好友下级
export const onGetUserSubirdinate = (uid) => get(`/union/union-order/personal-subordinate/${uid}`);

// 提现拒绝
export const onRefuseWithdraw = (data) => post(`/union/union-rabate/withdrawal-refuse`, data);
