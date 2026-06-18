/**
 * 统一请求封装 — 全局唯一出口,禁止页面/store 直接调 uni.request
 * 依赖方:src/api/modules/* 各业务模块
 * 修改注意:
 *   - api 域名切换走 config/env.ts 的 API_MAP,这里只负责拼 baseURL + Authorization + 拦截 code
 *   - 4001/401 拦截逻辑改动,会同时影响所有页面登录态(评估清楚再改)
 *   - 登录页 path 须与 pages.json 保持一致(/pages/login/login)
 *
 * 调用示例:
 *   import { request } from '@/api/request'
 *   request<{ list: News[] }>({ api: 'main', url: 'news/feed', data: { page: 1 }, loading: true })
 */
import { getApiBase, type ApiKey } from "@/config/env";
import type { ApiResponse } from "@/types/api";
import { showError } from "@/utils/message";

type RequestOptions = {
  api: ApiKey;
  url: string;
  method?: UniApp.RequestOptions["method"];
  data?: Record<string, unknown>;
  // 传字符串自定义文案,传 true 用默认"加载中..."
  loading?: string | boolean;
  // 4001/401 时跳转登录页,部分白名单接口(如游客资讯列表)可关掉
  homeToken?: boolean;
  // 显式覆盖本次请求的 token(场景:刚登录拿到 token 立即调下一个接口)
  token?: string;
};

// 模态框互斥锁:401 过期同一时段连点多个接口只弹一次,避免连环模态
let tipLogin = 1;

export function request<T = unknown>(options: RequestOptions): Promise<ApiResponse<T>> {
  // --- 请求前:拼 baseURL、附加 Authorization+token、可选 loading mask ---
  const baseURL = getApiBase(options.api);
  if (options.loading) {
    uni.showLoading({
      title: typeof options.loading === "string" ? options.loading : "加载中...",
      mask: true,
    });
  }
  const token = options.token || uni.getStorageSync("token");
  const authorization = token ? `Bearer ${token}` : "";

  return new Promise((resolve, reject) => {
    uni.request({
      url: baseURL + options.url,
      method: options.method || "GET",
      data: options.data,
      timeout: 15000,
      header: {
        Authorization: authorization,
        token: token || "",
        // 业务方按需启用:
        // UnionId: uni.getStorageSync('unionId') || '',
        // OpenId: uni.getStorageSync('openId') || '',
      },
      success(res) {
        const data = res.data as ApiResponse<T>;

        // --- 4001 未登录:静默跳 /pages/login/login(已在登录页则不再跳,避免栈循环) ---
        if (data.code === 4001 && !options.homeToken) {
          const pages = getCurrentPages();
          const route = pages[pages.length - 1]?.route;
          if (route !== "pages/login/login") {
            uni.navigateTo({ url: "/pages/login/login" });
          }
          reject(data);
          return;
        }

        // --- 401 登录过期:清 token + 弹一次 modal,确认后跳登录 ---
        if (data.code === 401 && !options.homeToken) {
          uni.removeStorageSync("token");
          if (tipLogin === 1) {
            tipLogin++;
            uni.showModal({
              content: "您的登录已过期，请重新登录！",
              showCancel: false,
              success(r) {
                tipLogin = 1;
                if (r.confirm) uni.navigateTo({ url: "/pages/login/login" });
              },
            });
          }
          reject(data);
          return;
        }

        // --- 业务失败:统一 toast + reject,调用方 catch 决定是否再处理 ---
        if (data.code !== 0) {
          showError(data.msg || "请求失败");
          reject(data);
          return;
        }

        resolve(data);
      },
      fail(err) {
        // --- 网络层失败:超时/无网络/DNS;不区分原因,提示弱网 ---
        showError("网络异常,请稍后重试");
        reject(err);
      },
      complete() {
        // --- 收尾:无论成功失败都关 loading,避免遮罩残留 ---
        if (options.loading) uni.hideLoading();
      },
    });
  });
}
