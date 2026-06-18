/**
 * 设计稿换算规则 — 750 设计稿,样式单位统一 rpx
 * 依赖方:全部 .vue / .scss 文件、新成员对照设计稿写样式
 * 修改注意:小程序运行时按屏幕宽度自动换算,改 designWidth 须同步告知设计同事重出标注
 */
export const DESIGN = {
  // 设计稿宽度;UI 给的标注按 750 来读,样式直接写 N rpx
  designWidth: 750,
  // 全局单位约束:禁止 px 硬编码(图片宽高除外),禁止引入 postcss-pxtorem
  unit: "rpx",
} as const;
