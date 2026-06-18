---
name: vue-fe-review
description: >-
  Review Vue3 + TS + Nuxt 代码,专抓响应式陷阱、SSR 反模式、路由硬编码跳转、性能/页面加载速度问题。
  Use when the user says "review 一下", "看看这段代码", "帮我审一下", "前端 review",
  "这代码有啥问题", or /vue-fe-review.
  一轮输出完整结论;提完建议后自省一次,仅优化空间大时补充,否则收口。只报告不擅自改代码。
---

# vue-fe-review: Vue3 + Nuxt 代码 review

对用户指定范围(文件 / 文件夹 / git diff / PR)做**一轮**前端专项 review,**只报告不擅自改代码**。
不做通用风格挑刺(缩进、命名、空行交给 lint)。

## 核心纪律

1. **只读不改** — 默认仅输出报告;用户说「按 review 改」「帮我修」后才编辑文件。改完后**不再**主动自省或提议二轮 review。
2. **一轮 + 自省一次** — 扫描 → 首轮报告 → 内部自省一次 → 收口。禁止第三轮思考。
3. **自省判定** — 假设用户已采纳全部首轮建议,**仍有 🔴 或明显 🟡** 遗漏 / 连锁问题 → 同份报告追加「补充建议」;只剩锦上添花、风格、主观审美 → 直接收口,不写补充。
4. **无 🔴🟡 = 可合入** — 不凑 🟢、不编造优化点、不翻旧代码的账(除非本次 diff 连锁出 bug)。🟢 仅在用户明确「深度 review」时输出。

## 启动:确定范围

用户已指定范围(文件 / 文件夹 / diff / PR) → 直接执行,不再问。
未指定 → `AskUserQuestion` 问一次:

| 选项 | 含义 |
|------|------|
| 当前 git diff | `git diff` + `git diff --cached` |
| 指定文件 | 1 个或多个文件路径(追问) |
| 指定文件夹 | 递归扫 `.vue` / `.ts` / `.tsx` / `.js`,跳过 `node_modules` / `dist` / `.nuxt` |
| 指定 PR/commit | `git show <ref>` 或 `git diff <base>..<head>` |

- diff 为空 → 告知,请改选文件 / 文件夹。
- 文件夹下源文件 >30 → 先列清单确认是否全扫。

读完后一句话说明范围(模式 + 路径 + 文件数),立即进入检查。

## 检查维度(按序,只扫 diff 行)

### 1. 响应式陷阱
- props 解构丢响应式(Vue <3.5 或编译器未开 reactive props destructure)
- `reactive` 对象解构 / 整体替换 → 失去响应式
- ref 嵌在普通对象里未 unwrap
- `watch` source 写错(漏 `() =>`;监听 reactive 漏 `deep`)
- computed 含副作用(请求 / 赋值 / log)
- 会增删 / 重排的 `v-for` 用 `index` 当 key

### 2. Nuxt SSR 反模式
- 顶层访问 `window` / `document` / `localStorage`(应 `import.meta.client` 守卫或挪 `onMounted`)
- `<script setup>` 顶层裸 `await fetch`(应 `useFetch` / `useAsyncData`)
- 跨组件共享态用普通 `ref` 而非 `useState`
- `useFetch` 放 `onMounted` 里(失去 SSR)
- SSR 路径下 `watch` 跑副作用
- `runtimeConfig` 私密字段无 `public.` 前缀 → 泄漏客户端 bundle

### 3. TypeScript 严重问题
- 无理由的 `any` / `as any`
- 可换类型守卫的 `as Foo`、危险 `!` 非空断言
- 前端字段名与后端响应不一致(`userId` vs `user_id`)

### 4. 性能 / 内存
- `addEventListener` / `setInterval` / `setTimeout` 未在 `onBeforeUnmount` 清理
- 大列表(>500 项且已卡)无虚拟滚动
- computed 内 O(n²) 重计算
- 大对象 / 不需响应的数据用深 `ref`(应 `shallowRef` / `markRaw`)

### 5. 页面加载速度(首屏 / LCP / 包体积)

无页面 / 路由 / 资源改动则跳过。

**🔴(明显拖慢首屏)**:
- 路由 / 页面同步 import 重包(整包 echarts、element-plus、antd、编辑器、地图、moment)— 应动态 `import()` 或按需
- `app.vue` / `main.ts` / 全局插件同步引入非必要重库,所有页面买单
- 顶层串行多个 `await useFetch` 形成请求瀑布,无依赖应并行
- 首屏 `<img>` / 背景图无尺寸 → CLS;首屏大图无 priority / preload
- 第三方脚本同步阻塞,无 `async` / `defer`

**🟡(可感知优化)**:
- 非页面级大组件未 `defineAsyncComponent` / `<LazyXxx>`
- 非首屏数据未 `lazy: true` 或未挪 `onMounted`(权衡 SEO)
- 非首屏 `<img>` 缺 `loading="lazy"`;有 `@nuxt/image` 却用裸 `<img>`;大图未压缩 / 未 webp
- `@font-face` 缺 `font-display: swap`;字重过多;关键字体未 preload
- `import 'xxx/dist/index.css'` 全量样式未按需
- icon 全量字体 / 整包 icons 仅用少量
- `prefetch` 滥用抢首屏带宽

```ts
// 路由懒加载
{ path: '/report', component: () => import('@/pages/Report.vue') }
// 重组件异步
const Chart = defineAsyncComponent(() => import('@/components/Chart.vue'))
// 非首屏请求延迟
const { data } = await useFetch('/api/extra', { lazy: true })
```

不报「可加 CDN」这种纯理论,必须对应 diff 具体位置。

### 6. 错误处理
- 请求无 try/catch、`useFetch` 未消费 `error.value`
- 列表 / 详情无 loading / 空态(用户可见白屏)

### 7. 路由与跳转(硬编码 path)

diff 出现 `window.location.href` / `location.assign` / `location.replace` / `location.href =` 等**站内路径**硬编码时,**必须先核对项目实际路由**再下结论:

**核对来源**(按框架,能读则读):
- Vue Router:`src/router/index.ts` 或 `src/router/routes.*`
- Nuxt:`pages/` 目录结构(文件路径即路由)
- 小程序式 Nuxt 模块:`pages.json` 的 `pages`

**🔴(路径不存在或必 404)**:
- 硬编码 path 在路由表 / `pages/` 中**找不到对应页面**,如 `window.location.href = '/login'` 但项目无 `pages/login` 且无 `/login` 路由
- 拦截器 401 / 4001 跳登录写死 `/login`,与项目实际登录 path 不一致(常见:`/user/login`、`/pages/login/login`)
- 大小写 / 尾斜杠与路由定义不一致导致生产 404

**🟡(路径存在但写法不当)**:
- 应用内跳转用 `window.location.href` 整页刷新,破坏 SPA 状态、SSR hydration — 应改用:
  - Nuxt:`await navigateTo('/login')` 或 `navigateTo({ name: 'login' })`
  - Vue Router:`router.push('/login')` 或 `router.push({ name: 'Login' })`
- 多处散落相同硬编码 path,未集中为路由常量(如 `ROUTES.LOGIN`)

**不报**:外链 `window.location.href = 'https://...'`、用户明确要求的新开窗口 `window.open(url, '_blank')`。

```ts
// ❌ 未核对路由 — 项目可能根本没有 /login
window.location.href = '/login'

// ✅ Nuxt(已确认 pages/login.vue 存在)
await navigateTo('/login')

// ✅ Vue Router
import { useRouter } from 'vue-router'
const router = useRouter()
router.push('/login')
```

报告须写明:**核对过哪些路由文件、项目实际登录 path 是什么、建议改成什么**。

### 8. 可访问性(仅 🔴)
- `<div @click>` 假按钮(无 role / 键盘可达)
- 关键图无 `alt`、表单无 `label`

不深扫 a11y。

### 9. fe-project-init 约定(存在 `src/config/design.ts` 时)
- 端 / 单位混用:PC 缺 1200 容器、移动缺 rem + 750 封顶、小程序误用 pxtorem
- 绕过 `config/env.ts` 直接拼 `import.meta.env.VITE_API_*`
- 绕过 `api/request.ts` 裸 axios / fetch

### 10. 设计纪律(仅 UI diff)

触发:`.vue` template / `tailwind.config*` / 全局样式(main.scss / app.css / uni.scss) / 字体相关。**纯逻辑 diff 跳过**。

- **紫色禁用** 🟡 — `purple-*` / `violet-*` / `indigo-*` Tailwind class、紫色 hex(`#6B21A8` `#7C3AED` `#8B5CF6` `#A78BFA` 等)、`from-purple` / `to-violet` 渐变 → 替换为项目 `brand-*` token
- **大色块纯白纯灰** 🟡(已上线 → 🔴)— 页面根容器 / hero 全屏 `bg-white` / `bg-gray-50` / `bg-gray-100`,无渐变 / 纹理 / 边框
- **零动效交互** 🟡 — `<button>` / `<a>` / 卡片无任何 `transition` / `hover:` / `active:` 反馈 → 加 `transition-all duration-200` + hover / active
- **覆盖项目字体** 🟡 — 已注入 Google Fonts 但 diff 出现 `font-family: sans-serif` / `-apple-system` 直接覆写
- **响应式断点缺失** 🟡(已上线 → 🔴)— 新增大跨度组件 / 页面无任何 `md:` / `lg:` / `@media` → 提示补 375 / 768 / 1280 三档
- **硬编码颜色字号** — 项目有 token 体系时 `color: #xxx` / `font-size: 14px` 裸值 → 仅在用户要求深度 review 时报为 🟢

不报主观审美。

## 执行流程

```
1. 确定范围(询问或直接读 diff)
2. 按维度扫 → 分级(🔴🟡;🟢 默认忽略)
3. 输出首轮报告(每条:文件:行 — 问题 — 原因 — 建议改法+代码片段)
4. 内部自省一次(不输出推理):假设全采纳,是否仍有 🔴 或明显 🟡 遗漏 / 连锁问题?
   ├─ 是 → 同份报告追加「## 补充建议」(只列重大项)→ 收口
   └─ 否 → 直接收口
5. 等用户确认
```

**很大优化空间**(满足任一即补充):未覆盖的 🔴(线上风险 / SSR 报错 / 数据错乱)/ 修 A 会暴露未修的 🔴🟡 / 同根因还有 2+ 处同类首轮漏报。

**禁止**:
- review 阶段动用户代码
- 自省超过一轮
- 仅剩锦上添花仍写「还可继续优化」并凑 🟢
- 主动提议「要不要再扫一遍」(用户主动要求除外)
- 翻未改动旧代码的账(除非本次 diff 连锁出 bug)

**用户授权后改代码**:按报告逐项修改 → 一句话说明改了什么 → 结束。**不再二次自省 / 二轮 review**。

## 输出格式

按严重程度分组,**不按文件分组**:

```
## vue-fe-review 完成(一轮)
**范围**: N 个文件,约 M 行变更

## 🔴 必改(线上风险 / 数据错乱 / SSR 报错 / 路由 404)
1. `api/request.ts:42` — `window.location.href = '/login'` 但项目无 `/login` 路由
   原因: 401 时跳转 404,用户无法登录
   核对: `pages/` 仅有 `pages/user/login.vue` → 实际 path `/user/login`
   建议:
   await navigateTo('/user/login')  // Nuxt
   // 或 router.push('/user/login')

## 🟡 建议改(性能 / 维护性 / 加载速度)
1. `pages/index.vue:8` — 同步 import echarts 增大首屏 bundle → 改 `defineAsyncComponent`
   ...

## 补充建议(仅自省后空间大时输出,否则整节省略)
1. `index.vue:80` — 修完 props 后父组件传参缺类型守卫
   ...

**结论**: 共 X 必改 / Y 建议改 [+ Z 补充]。确认后我可按项修改。
```

无 🔴🟡 时:
```
## vue-fe-review 完成(一轮)
**范围**: ...
**结论**: 未发现明显问题,可合入。
```

每条必含 **文件:行 — 问题** → **原因 / 复现** → **建议改法(代码片段)**。不写「改一下」这种空话。
