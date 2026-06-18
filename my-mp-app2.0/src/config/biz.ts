/**
 * 业务方向 — 决定 tabBar 结构 与 首页样板形态(商城/新闻/视频/自定义)
 * 依赖方:pages.json tabBar.list 顺序、pages/index 样板、README 目录导读
 * 修改注意:改 type 须同步 pages.json + 各 tab 页占位 + 报告里的方向描述
 */
export type BizType = "mall" | "news" | "video" | "custom";

export const BIZ = {
  // 当前方向:新闻
  type: "news" as BizType,
  // 中文标签,展示在 README / 我的页等位置
  label: "新闻",
} as const;
