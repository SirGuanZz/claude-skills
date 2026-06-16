---
name: vue-component-gen
description: >-
  快速生成 Vue3 + TS + Nuxt 组件/页面骨架，自动匹配项目目录约定、UI 库、状态库、请求封装。
  Use when the user says "生成组件", "新建组件", "建一个页面", "起个骨架", "搭个 xxx 组件",
  "写个 xxx 页面" or /vue-component-gen.
---

# vue-component-gen: Vue3 + TS + Nuxt 组件/页面骨架生成

职责：从一句话描述（"做一个用户卡片组件"）产出符合**当前项目约定**的组件/页面骨架，包含结构、样式、Props/Emits 类型、必要的 composable、占位单测。

**核心纪律：先读项目，再写代码。** 不猜目录、不猜 UI 库、不引新依赖。

---

## 启动：先把这些读清楚

进入 skill 后，**按顺序**做：

### 1. 探测项目结构（决定文件放哪、怎么写）

并行读：

- `package.json` → 确认 Vue 版本、Nuxt 版本（2/3）、UI 库（element-plus / vant / nuxt-ui / naive-ui / ant-design-vue）、状态库（pinia / vuex）、请求封装（axios / ofetch / `$fetch`）、CSS 方案（tailwind / unocss / scss / css module）、单测框架（vitest / jest）
- `nuxt.config.ts` / `nuxt.config.js` → 确认 `srcDir`、`components` 自动导入、`imports` 自动导入、`css` 全局样式、`modules` 启用的模块
- `tsconfig.json` → 确认路径别名（`~/`、`@/`、`#imports`）
- 根目录 ls → 确认是 Nuxt3 标准结构（`components/`、`pages/`、`composables/`、`server/`、`layouts/`）还是定制结构

### 2. 找一个"参照组件"（关键，决定代码风格）

从 `components/` 里挑一个**和目标组件最相似**的现有组件读完整内容：

- 要做卡片 → 读现有任一 `*Card.vue`
- 要做表单 → 读现有任一 `*Form.vue`
- 要做列表 → 读现有任一 `*List.vue`
- 要做页面 → 读 `pages/` 下最近修改的一个页面

参照点：
- `<script setup lang="ts">` 还是 Options API
- Props 用 `defineProps<{...}>()` 还是 `withDefaults`
- 样式用 `<style scoped>` / `<style module>` / tailwind class
- 命名（PascalCase / kebab-case）、文件结构（单文件 / 目录 + index）
- 是否用 `<script setup>` 顶部 `definePageMeta` / `defineOptions`

**没有参照组件**（新项目/空目录）→ 用 Nuxt3 默认约定，并明确告诉用户"项目里没找到同类组件，按 Nuxt3 默认风格生成，你看下要不要调整"。

### 3. 与用户确认意图（信息不全才问，别滥用 AskUserQuestion）

用户说"做一个用户卡片"——多数情况能直接动手。需要补问的场景：

- **目录不明确**：项目里有多个候选目录（`components/business/` vs `components/common/`）→ 问放哪个
- **变体不明确**：用户说"做个按钮"，但项目里已有 `BaseButton`、`PrimaryButton`、`IconButton` → 问要哪种风格 / 要不要扩展现有的
- **数据来源不明**：用户说"做用户列表页"，但没说数据从哪来（接口？mock？props？）→ 问一次

**不要为了"显得严谨"反复确认**。能从参照组件推断的就直接做，做完让用户看。

---

## 生成内容（按用户要的类型）

### A. 普通组件（`components/Xxx.vue`）

骨架包含：

```vue
<script setup lang="ts">
// 1. Props 类型 — 用 interface + withDefaults（如果项目里现有组件用这种）
interface Props {
  // 按用户描述生成,带 JSDoc 标注必填/可选/默认
}
const props = withDefaults(defineProps<Props>(), {
  // 默认值
})

// 2. Emits — 命名空间用动词 + 主语,带 payload 类型
const emit = defineEmits<{
  click: [id: string]
  change: [value: ...]
}>()

// 3. 必要的本地状态 / computed
// 4. 暴露给父级的方法用 defineExpose (仅在父级需要 ref 调用时)
</script>

<template>
  <!-- 用项目 UI 库的组件,不裸写 div + 样式重造轮子 -->
</template>

<style scoped>
/* 仅当项目用 scoped CSS;tailwind 项目则全部走 class */
</style>
```

### B. 页面（`pages/xxx.vue`）

额外包含：

- `definePageMeta({ title, layout, middleware })`——按项目现有页面的元数据习惯
- `useHead` / `useSeoMeta`——SEO 必要时加，简单内部页不用强加
- 数据获取用 `useFetch` / `useAsyncData`——**按项目现有页面的方式**，不擅自换
- 错误态 / loading 态 / 空态——三态都要有占位结构，**不要只写 happy path**

### C. Composable（`composables/useXxx.ts`）

骨架：

```ts
export function useXxx(...) {
  const state = ref(...)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function execute(...) {
    // ...
  }

  return {
    state: readonly(state),  // 默认只读暴露,需写时再放开
    loading: readonly(loading),
    error: readonly(error),
    execute,
  }
}
```

返回值用 `readonly` 包裹只读状态——避免外部直接改内部 ref 导致响应式断裂。

### D. 占位单测（`*.test.ts` 同目录或 `__tests__/`）

只在项目有 vitest/jest 时生成。骨架覆盖：
- 渲染快照
- Props 主要分支
- Emits 触发
- 不为没有意义的场景写测试（"测试 div 存在"这种不要）

**项目没装单测框架**：不主动引入，告诉用户"项目没装 vitest，跳过单测；要我加上吗？"

---

## 铁律（违反 = 重写）

1. **不引新依赖**。要用 lodash 但项目没装 → 用原生实现，或问用户。
2. **不重新约定路径别名**。项目用 `~/` 就跟着 `~/`，别混用 `@/`。
3. **不写"防御性"代码堆**：不为 props 加 `if (!props) return null`（Vue 保证 props 非 null）；不给每个 ref 都包 try/catch。
4. **不写无意义注释**：`// Props` 这种废话注释删掉。注释只写"为什么这么做"，不写"这是什么"。
5. **样式跟项目方案走**：tailwind 项目就全 class，不混 `<style scoped>`；用了 unocss 就不要再写 tailwind。
6. **Nuxt 自动导入要用上**：`ref` / `computed` / `useRoute` / `useFetch` 这些项目里自动导入了就**不要手动 import**（多余的 import 会被 lint 警告）。读 `nuxt.config.ts` 的 `imports` 配置确认。
7. **类型不使用 `any`**：宁可写 `unknown` + 类型守卫，也不用 `any` 蒙混。第三方库类型缺失才允许 `any`，并在旁边注明。

---

## 完成后的报告

生成完后给用户一句话总结：

```
✅ 已生成 {N} 个文件:
  - components/UserCard.vue (组件骨架)
  - components/UserCard.test.ts (单测占位)
参照组件:components/ProductCard.vue (复用了它的 scoped 样式风格 + Props 写法)
未做:接口对接 (你没提到数据来源,留了 mock 数据 — 要对接告诉我接口路径)
```

让用户清楚：**做了什么、参照了什么、留了什么坑**。
