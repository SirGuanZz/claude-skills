/**
 * 设计稿与端适配约定 — 全项目 UI 单位/布局的单一真相源
 * 依赖方:layouts/DefaultLayout.mobile-container 宽度、tailwind.config 自定义、vue-component-gen 读 platform
 * 修改注意:改 designWidth 或 platform 时同步检查 .mobile-container max-width 与 tailwind 配置
 */
export type Platform = 'pc' | 'mobile'

export const DESIGN = {
  // 当前端:移动 H5
  platform: 'mobile' as Platform,
  // 设计稿宽度;移动 H5 通常 750
  designWidth: 750,
  // 内容区最大宽度(px);移动 H5 PC 预览时容器居中到此宽度
  contentWidth: 750,
  // 仅 PC + 自适应才置 true;移动 H5 不适用
  responsive: false,
  // Tailwind 路径:不引 postcss-pxtorem,直接用默认 rem 体系 + viewport
  unit: 'tailwind-rem' as 'px' | 'px→rem' | 'tailwind-rem',
  // 当前项目无接口;后续加接口时改 true 并补 .env / config/env.ts / api/request
  hasApi: false,
} as const
