/**
 * 统一 toast/loading 出口 — 禁止页面或 store 直接调 uni.showToast
 * 依赖方:request 拦截器、所有页面交互反馈
 * 修改注意:
 *   - 错误用 icon=none(避免 X 图标遮挡长文案)
 *   - 成功用 icon=success(标题不超过 7 个字,uni 限制)
 *   - 后续若接入自定义弹层,改这里即可全局替换
 */
export function showError(msg: string) {
  uni.showToast({ title: msg || "请求失败", icon: "none" });
}

export function showSuccess(msg: string) {
  uni.showToast({ title: msg, icon: "success" });
}
