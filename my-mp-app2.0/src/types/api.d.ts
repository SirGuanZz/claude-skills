/**
 * 后端统一返回结构 — 按后端实际结构调整
 * code: 0 表示成功;4001 未登录;401 登录过期;其余按业务约定
 * data: 业务数据,泛型 T 由调用方收紧
 * msg:  失败时给前端提示,成功时通常为空字符串
 */
export interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  msg: string;
}
