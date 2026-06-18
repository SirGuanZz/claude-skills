/**
 * 用户模块接口 — 登录 / 一键登录手机号解密 / 退出
 * 依赖方:pages/login、pages/mine
 * 修改注意:解密接口返回的 token 写入 storage 后,后续 request 自动带上,无需调用方再处理 header
 */
import { request } from "@/api/request";

export interface LoginResult {
  token: string;
  userId: string;
  nickname: string;
  avatar: string;
}

/**
 * 手机号 + 验证码登录
 * @returns LoginResult,token 写入 storage 后即时生效
 */
export const loginBySms = (phone: string, code: string) =>
  request<LoginResult>({
    api: "main",
    url: "user/login/sms",
    method: "POST",
    data: { phone, code },
    loading: "登录中...",
    homeToken: true,
  });

/**
 * 发送短信验证码
 * 60s 内同一手机号后端会限流,前端按钮自管 60s 倒计时即可
 */
export const sendSmsCode = (phone: string) =>
  request<null>({
    api: "main",
    url: "user/login/sms/send",
    method: "POST",
    data: { phone },
    homeToken: true,
  });

/**
 * 一键登录:微信 code + getPhoneNumber 加密数据 → 后端解密拿手机号 → 直接登录
 * code 由 uni.login 拿到;encryptedData/iv 由 button open-type=getPhoneNumber 回调拿到
 */
export const loginByWxPhone = (params: {
  code: string;
  encryptedData: string;
  iv: string;
}) =>
  request<LoginResult>({
    api: "main",
    url: "user/login/wx-phone",
    method: "POST",
    data: params,
    loading: "登录中...",
    homeToken: true,
  });
