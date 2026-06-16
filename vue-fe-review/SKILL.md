---
name: vue-fe-review
description: >-
  Review Vue3 + TS + Nuxt 代码,专抓响应式陷阱、SSR 反模式、性能/内存问题。
  Use when the user says "review 一下", "看看这段代码", "帮我审一下", "前端 review",
  "这代码有啥问题", or /vue-fe-review.
---

# vue-fe-review: Vue3 + Nuxt 代码 review

职责：对当前 diff 或指定文件做一轮**前端专项 review**，重点抓 Vue3 响应式、Nuxt SSR、TypeScript、性能/内存问题。**不做通用代码风格挑刺**（缩进、变量名、空行那些交给 lint）。

---

## 启动：明确 review 范围

1. **没指定范围** → 默认 review 当前 git diff（未提交 + 已暂存）。先 `git diff` 和 `git diff --cached` 看一遍。
2. **指定文件** → 只读那些文件。
3. **指定 PR/commit** → `git show <ref>` 或 `git diff <base>..<head>`。

读完后**先告诉用户范围**："本次 review 覆盖 N 个文件，约 M 行变更，主要涉及 xxx"。

---

## Review 维度（按这个顺序检查，不要跳）

### 1. 响应式陷阱（Vue3 最容易踩的坑）

逐个 `.vue` / `.ts` 文件扫：

- **解构 props 丢失响应式**：
  ```ts
  // ❌ 错
  const { count } = defineProps<{ count: number }>()
  // ✅ 对
  const props = defineProps<{ count: number }>()
  // 或用 toRefs
  ```
  *例外*：Vue 3.5+ 的 reactive props destructure（`vue@>=3.5` + 编译器开启）允许直接解构，要先看 `package.json` 的 vue 版本。

- **`reactive` 对象解构/赋值丢响应式**：
  ```ts
  const state = reactive({ count: 0 })
  const { count } = state  // ❌ count 不再响应
  state = { count: 1 }      // ❌ 整体替换不会触发更新
  ```

- **ref 在模板里多写 `.value`**：模板里 ref 自动 unwrap，但放在对象里就不会（`{{ obj.myRef.value }}` vs `{{ obj.myRef }}`）。

- **watch 监听 reactive 对象用错 source**：
  ```ts
  // ❌ 监听整个对象需要 deep,但写法常被遗漏
  watch(state, ...)  // 不会触发(reactive 对象本身引用不变)
  // ✅
  watch(() => state.x, ...)
  watch(state, ..., { deep: true })
  ```

- **computed 里有副作用**：computed 必须纯函数，不要在里面 `console.log` / 改其他 ref / 发请求。

- **v-for 里用 `index` 当 key**：列表会增删/重排时会导致状态错位；只有静态、无状态、永不重排的列表才允许。

### 2. Nuxt SSR 反模式（线上才暴露的坑）

- **直接访问 `window` / `document` / `localStorage`**：会 SSR 报错。要用 `if (process.client)` / `if (import.meta.client)` 包裹，或放 `onMounted` 里。
- **顶层异步**：`<script setup>` 顶层 `await fetch(...)` 会让组件成 async 组件，没用 `<Suspense>` 会有 hydration 警告。Nuxt 数据获取应该用 `useFetch` / `useAsyncData` / `$fetch`。
- **`useState` vs `ref`** 混用：跨组件共享状态在 SSR 必须用 `useState`，否则服务端和客户端拿到不同实例。
- **`useFetch` 在 onMounted 里调用**：失去 SSR 能力，应该顶层调用。
- **`watch` 在 SSR 里跑副作用**：服务端 watch 不应该有副作用（如发请求）。用 `onMounted` 包裹或 `process.client` 守卫。
- **环境变量泄漏**：`useRuntimeConfig().xxx`（无 public 前缀）泄漏到客户端会被打包进 bundle。检查 `nuxt.config.ts` 的 `runtimeConfig` 划分。

### 3. TypeScript 严重问题

- **`any` 滥用**：找出所有 `: any` 和 `as any`，每个都要有理由（第三方库无类型 / 临时绕过）。
- **断言滥用**：`as Foo` 比类型守卫弱，能换守卫就换。
- **`!` 非空断言**：每个 `obj!.x` 都要确认确实非空，否则换成 `?.` 或 if 守卫。
- **接口和后端字段对不上**：如果改的是接口对接代码，比对接口定义和实际字段（前端定义 `userId: string` 但后端返回 `user_id` 这种）。

### 4. 性能 / 内存

- **未清理的事件监听 / 定时器**：`addEventListener` / `setInterval` / `setTimeout` 在 `onMounted` 里加了，没在 `onBeforeUnmount` / `onUnmounted` 里清。Nuxt 服务端组件尤其要小心。
- **大列表无虚拟滚动**：`v-for` 渲染 1000+ 项 → 建议虚拟滚动（vue-virtual-scroller / el-virtualized-list）。
- **computed 里跑重计算**：每次依赖变都跑一次 O(n²) 的算法 → 建议加缓存或拆 watch。
- **图片无 lazy / 无尺寸**：`<img>` 不加 `loading="lazy"`、不指定宽高 → 影响 LCP 和 CLS。
- **未必要的深响应式**：大对象/不需要响应的数据用 `shallowRef` / `markRaw`，不用普通 `ref`。

### 5. 错误处理边界

- **接口请求无错误处理**：`await $fetch(...)` 没 try/catch，失败会抛到组件外。
- **`useFetch` / `useAsyncData` 没用 `error`**：模板里只渲染 `data`，不处理 `error.value`。
- **空态 / loading 态缺失**：列表组件只写 happy path，数据为空时白屏。

### 6. 可访问性（轻量检查，不展开）

- 交互元素是不是 `<button>` / `<a>`，而不是带 `@click` 的 `<div>`
- 图片有 `alt`
- 表单有 `<label>` 关联

不深扫无障碍——那是 a11y-check 的职责。这里只点最基础的。

---

## 输出格式（严格遵守）

按"严重程度"分组，**不要按文件分组**——同类问题集中显示便于一次处理：

```
## 🔴 必改（线上风险 / 数据错乱 / SSR 报错）

1. components/UserCard.vue:23 — props 解构丢失响应式
   const { count } = defineProps(...) — count 不会跟随父级更新
   建议:改成 const props = defineProps(...);用 props.count

2. pages/index.vue:45 — 顶层访问 window 会 SSR 报错
   ...

## 🟡 建议改(性能 / 维护性)

1. components/List.vue:12 — v-for 用 index 当 key
   ...

## 🟢 可选改进(锦上添花)

1. ...
```

每条问题包含：**文件:行号 — 一句话问题描述**，下一行**为什么是问题 / 复现条件**，再下一行**建议怎么改**（给具体代码片段，不要只说"改一下"）。

**不报告未改动的代码里的旧问题**——除非那旧问题导致这次改动有 bug。Review 范围 = 本次 diff，不是整个项目。

---

## 完成后的总结

最后一段给用户一个判断：

```
总结:本次 diff 共发现 X 个必改 / Y 个建议改 / Z 个可选。
建议先处理必改,合入前我可以再扫一遍。
```

不灌水、不夸奖、不写"代码整体写得很好"这种废话。**有问题就讲问题，没问题就说"没发现明显问题，可以合入"**。
