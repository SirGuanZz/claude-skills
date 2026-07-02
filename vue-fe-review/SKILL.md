---
name: vue-fe-review
description: >-
  Review Vue3 + TS + Nuxt 代码,只做三件事:审代码错误、优化加载速度、检查内存泄漏。
  Use when the user says "review 一下", "看看这段代码", "帮我审一下", "前端 review",
  "这代码有啥问题", "检查内存泄漏", "看看加载速度", or /vue-fe-review.
  一轮输出完整结论;提完建议后自省一次,仅优化空间大时补充,否则收口。只报告不擅自改代码。
  安全 / 测试覆盖走 `pre-pr-review`;类型完整性、设计纪律、命名风格不在本 skill 范围。
---

# vue-fe-review: Vue3 + Nuxt 代码 review

对用户指定范围(文件 / 文件夹 / git diff / PR)做**一轮**前端 review,**只报告不擅自改代码**。

## 职责三件事

1. **代码错误** — 会导致运行时 bug、SSR 报错、页面 404、数据错乱的 Vue / Nuxt 特有错误
2. **加载速度** — 首屏 / LCP / 包体积 / 请求瀑布
3. **内存泄漏** — 未清理的监听器 / 定时器 / observer、深响应式大对象、大列表未虚拟化

其他一律不报:类型宽泛、命名风格、设计审美、代码格式、注释缺失、可测试性、a11y 深扫。安全和测试覆盖走 `pre-pr-review`。

## 核心纪律

1. **只读不改** — 默认仅输出报告;用户说「按 review 改」「帮我修」后才编辑文件。改完后**不再**主动自省或提议二轮 review。
2. **一轮 + 自省一次** — 扫描 → 首轮报告 → 内部自省一次 → **输出自省结论** → 收口。禁止第三轮思考。
3. **自省判定** — 假设用户已采纳全部首轮建议,**仍有 🔴 或明显 🟡** 遗漏 / 连锁问题 → 追加「补充建议」,自省结论标「追加 N 项」;只剩锦上添花 → 直接收口,自省结论标「未发现遗漏」。
4. **无 🔴🟡 = 可合入** — 不凑 🟢、不编造优化点、不翻旧代码的账(除非本次 diff 连锁出 bug)。

## 启动

默认走 `git diff` + `git diff --cached`,直接读进检查,不询问。

例外(才 `AskUserQuestion`):
- diff 为空 → 让用户挑范围(指定文件 / 文件夹 / PR / commit)
- 用户给的范围模糊(「review 一下登录模块」但路径不明)

文件夹下源文件 >30 → 先列清单确认是否全扫。

## 检查项

### 1. 代码错误

**响应式**:
- `reactive` 对象解构 / 整体替换 → 失去响应式
- props 解构丢响应式(Vue <3.5 或未开 reactive props destructure)
- ref 嵌普通对象未 unwrap
- `watch` source 漏 `() =>`;监听 reactive 漏 `deep`
- computed 含副作用(请求 / 赋值)
- 会增删 / 重排的 `v-for` 用 `index` 当 key

**Nuxt SSR**:
- 顶层访问 `window` / `document` / `localStorage`(应 `import.meta.client` 守卫或挪 `onMounted`)
- `<script setup>` 顶层裸 `await fetch`(应 `useFetch` / `useAsyncData`)
- 跨组件共享态用普通 `ref` 而非 `useState`
- `useFetch` 放 `onMounted` 里(失去 SSR)
- `runtimeConfig` 私密字段无 `public.` 前缀(注:属敏感信息泄漏,末尾提醒转 `pre-pr-review`)

**路由跳转 404**:diff 出现 `window.location.href = '/xxx'` 等站内硬编码时,**必须核对**项目实际路由(Vue Router 的 `router/index.ts` 或 Nuxt 的 `pages/` 目录),路径不存在或与实际登录 path 不一致 → 🔴;应用内跳转用整页刷新 → 🟡 建议改 `navigateTo` / `router.push`。报告须写明:核对过哪些文件、实际 path 是什么、建议改成什么。

**其他运行时错误**:
- 危险 `!` 非空断言把 null 塞进后续调用
- 请求无 try/catch + 无 `error.value` 消费 → 未捕获 promise
- 表单提交无防重复,可能触发多次副作用

### 2. 加载速度

无页面 / 路由 / 资源改动则跳过。

**🔴 明显拖慢首屏**:
- 页面 / 路由同步 import 重包(整包 echarts、element-plus、antd、编辑器、地图、moment)→ 动态 `import()` 或按需
- `app.vue` / `main.ts` / 全局插件同步引入非必要重库,所有页面买单
- 顶层串行多个 `await useFetch` 形成请求瀑布,无依赖应并行
- 首屏 `<img>` / 背景图无尺寸 → CLS;首屏大图无 `preload` / `priority`

**🟡 可感知优化**:
- 非页面级大组件未 `defineAsyncComponent` / `<LazyXxx>`
- 非首屏数据未 `lazy: true`
- 非首屏 `<img>` 缺 `loading="lazy"`;有 `@nuxt/image` 却用裸 `<img>`;大图未压缩 / 未 webp
- `@font-face` 缺 `font-display: swap`;字重过多;关键字体未 preload
- 全量 CSS / 全量 icon 仅用少量

```ts
// 路由懒加载
{ path: '/report', component: () => import('@/pages/Report.vue') }
// 重组件异步
const Chart = defineAsyncComponent(() => import('@/components/Chart.vue'))
// 非首屏请求延迟
const { data } = await useFetch('/api/extra', { lazy: true })
```

### 3. 内存泄漏

- `addEventListener` / `setInterval` / `setTimeout` / `IntersectionObserver` / `ResizeObserver` / WebSocket / 事件总线订阅未在 `onBeforeUnmount` 清理
- 大列表(预期 >500 项且无虚拟化 / 分页)持续 push 不释放
- 大对象 / 不需响应的数据用深 `ref`(应 `shallowRef` / `markRaw`)
- 闭包持有已卸载组件实例 / DOM 引用

## 分级

- 🔴 **必改** — 线上会挂 / 数据错乱 / SSR 报错 / 路由 404 / 明确内存泄漏 / 明显拖慢首屏
- 🟡 **建议改** — 可感知的加载优化、可预见的运行时错误、非致命响应式陷阱
- 🟢 默认不输出,仅用户明确「深度 review」时给

## 执行流程

```
1. 默认读 git diff(+ --cached);无 diff 才弹选项
2. 按 1. 代码错误 → 2. 加载速度 → 3. 内存泄漏 顺序扫 → 分级 🔴🟡
3. 输出首轮报告(每条:文件:行 — 问题 — 原因 — 建议改法+代码片段)
4. 内部自省一次:假设全采纳,是否仍有 🔴 或明显 🟡 遗漏 / 连锁问题?
   ├─ 是 → 追加「## 补充建议」→ 自省结论「追加 N 项」→ 收口
   └─ 否 → 自省结论「未发现遗漏」→ 直接收口
5. 等用户确认
```

## 输出格式

```
## vue-fe-review 完成(一轮)
**范围**: N 个文件,约 M 行变更

## 🔴 必改
1. `file:line` — 问题标题
   原因: 会导致什么问题
   建议: 具体改法
   ```代码片段```

## 🟡 建议改
1. `file:line` — ...

## 补充建议(仅自省后空间大时输出,否则整节省略)
1. ...

## 疑似安全 / 测试(建议再跑 pre-pr-review)
- `file:line` — 一句话看到了什么,不下结论
- 无则整节省略

**自省结论**: 未发现遗漏 / 追加 N 项
**结论**: 共 X 必改 / Y 建议改。确认后我可按项修改。
```

无 🔴🟡 时:

```
## vue-fe-review 完成(一轮)
**范围**: ...
**自省结论**: 未发现遗漏
**结论**: 未发现明显问题,可合入。
```

## 禁止

- review 阶段动用户代码
- 自省超过一轮
- 越界输出类型完整性、设计纪律、命名风格、代码格式、a11y 深扫结论
- 输出安全漏洞 / 测试覆盖结论(只在末尾提醒转 `pre-pr-review`)
- 翻未改动旧代码的账(除非本次 diff 连锁出 bug)
- 主动提议「要不要再扫一遍」(用户主动要求除外)
- 在报告 / 中文回复中使用斜体(`*文字*` / `_文字_`);需要强调统一用粗体,引用文件 / 行号 / 字段名 / 命令用反引号

**用户授权后改代码**:按报告逐项修改 → 一句话说明改了什么 → 结束。**不再二次自省 / 二轮 review**。
