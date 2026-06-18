# mobile-h5-app

移动 H5 前端骨架(Vue3 + Vite + TS + Tailwind v3 + Vant)。

## 项目类型

**纯静态 / 无接口**:不生成 axios / .env 域名 / dev proxy / 会员模块。
后续接入接口时,补 `.env.example` + `src/config/env.ts` + `src/api/request.ts` 四件套。

## 端 / 设计稿

- 端:移动 H5
- 设计稿:750(标注按 750 读)
- 单位:Tailwind 默认 rem 体系(不引 postcss-pxtorem),容器 `max-width: 750px`,大屏 PC 浏览时居中显示成手机宽
- 视口:`<meta name=viewport content="width=device-width, initial-scale=1.0">`

## 目录导读(给后续开发者)

| 路径 | 职责 |
|------|------|
| index.html | viewport + Google Fonts preconnect + 双字族 link |
| tailwind.config.ts | brand 占位玫红色阶 + Inter/Space Grotesk + hero-gradient,改 brand 同步 README |
| postcss.config.js | tailwindcss + autoprefixer |
| src/assets/main.css | @tailwind 三层 + base typography + .mobile-wrapper / .mobile-container / .bg-decor |
| src/config/design.ts | platform=mobile / designWidth=750 / hasApi=false 的单一真相源 |
| src/layouts/DefaultLayout.vue | mobile-wrapper + Header + RouterView + TabBar;**RouterView 裸写,不套 transition/Suspense** |
| src/components/layout/AppHeader.vue | 顶栏 logo + 搜索 |
| src/components/layout/AppTabBar.vue | 底部 TabBar,新增 tab 须同步 router/index.ts |
| src/components/common/AppPopup.vue | 通用弹窗,fade + translate-y 入场动效 |
| src/router/index.ts | **路由全部同步 import**,首页 + 关于;Vue Router 5.x 懒加载会触发切换白屏 |
| src/views/HomeView.vue | 审美样板:hero + CTA + Feature Grid + Vant 演示;可整体替换 |
| src/views/AboutView.vue | 占位关于页 |

## 启动

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # type-check + build
npm run type-check   # 单独跑 vue-tsc
```

> Node 版本要求 `^22.18 || >=24.12`(脚手架默认)。当前若用 Node 25 会有 EBADENGINE 警告但不阻塞。

## 路由切换手测

vue-router 5.x SPA 客户端切换属客户端行为,**build 验不到**。
启动后请手动:点击底部 TabBar 在 `/` 与 `/about` 来回切换,确认无白屏闪烁。
若发现白屏 → 检查 `src/router/index.ts` 是否有 `() => import(...)` 懒加载未同步,以及 `DefaultLayout.vue` 内 `<RouterView />` 是否被 `<transition>` / `<Suspense>` 包裹。

## 设计纪律(继承自 ~/.claude/CLAUDE.md)

- **字体**:Inter(正文)+ Space Grotesk(标题),已通过 Google Fonts preconnect 注入
- **主色**:占位 brand 色阶在 `tailwind.config.ts`(rose 玫红 #E11D48 系),按品牌替换
- **背景**:`.bg-decor` 渐变 + 噪点,禁纯白纯灰大面积铺底
- **动效**:按钮 / 卡片 hover & active 微动效,200ms ease-out
- **响应式**:375 / 768 / 1280 三档下 `.mobile-container` 不溢出(PC 大屏自动居中)
- **禁**:紫色背景或主题色 / 默认系统字体 / SaaS 模板风 / 零动效页面 / 硬编码颜色字号

## 待替换

- [ ] brand 主题色:占位玫红 → 品牌真实色阶(改 `tailwind.config.ts` 的 `colors.brand`)
- [ ] logo / 站点名:`AppHeader.vue` 的 `M` 图标块 + `Mobile App` 文案
- [ ] TabBar 图标 / 文案:`AppTabBar.vue`
- [ ] HomeView 业务壳替换:hero 文案 + features 列表 + Vant demo
- [ ] favicon.ico:public 目录占位

## 后续生成业务组件 / 页面

可调用 `/vue-component-gen` skill,会读取 `src/config/design.ts` 自动按移动端 750 稿生成。
