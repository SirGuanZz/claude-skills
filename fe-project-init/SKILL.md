---
name: fe-project-init
description: >-
  从 0 开始创建前端项目骨架,按问答确定技术栈,自动生成接口拦截器(双域名)、
  公共 Header/Footer/Popup 组件,可选会员状态管理。
  Use when the user says "新建项目", "创建项目", "起一个项目", "从零搭项目",
  "初始化项目", "搭个前端架子", or /fe-project-init.
---

# fe-project-init: 前端项目从零初始化

职责：从 0 起一个能立即跑起来的前端项目骨架，覆盖技术栈选型 → 拦截器（双域名）→ 公共组件 → 可选会员状态管理。

**核心纪律**：先问清楚再动手，问答驱动。每个选择都决定后面文件长什么样，不要先动手再返工。

---

## 启动：问答收集需求（按顺序，不要跳）

进入 skill 后，**用 `AskUserQuestion` 一次发问、收齐核心信息**，缺啥再追问。

### 问题 1：框架与渲染模式

```
要哪种框架?
- Vue3 + Vite (SPA,纯前端项目最常见)
- Nuxt3 (Vue3 + SSR,要 SEO / 首屏性能)
- React + Vite (SPA)
- Next.js (React + SSR/SSG)
- uni-app (跨端小程序 + H5)
- 原生微信小程序
```

### 问题 2:语言

```
TypeScript 还是 JavaScript? (推荐 TS)
```

### 问题 3:样式方案

```
样式用什么?
- Sass / SCSS (推荐,支持嵌套、变量、mixin)
- CSS (原生,简单项目够用)
- Tailwind CSS (原子化,快但要适应)
- UnoCSS (Tailwind 兼容 + 性能更好)
```

### 问题 4:UI 组件库（按框架给候选）

- Vue3 / Nuxt3 → Element Plus / Vant (移动) / Naive UI / Nuxt UI
- React / Next → Ant Design / MUI / shadcn-ui / Chakra
- uni-app → uni-ui / uView
- 「不用 UI 库」也是选项，告诉用户裸搭后续要自己写按钮/输入框等基础组件

### 问题 5:接口域名

```
请提供两套接口域名:
- 开发环境(dev): 例 https://dev-api.xxx.com
- 生产环境(prod): 例 https://api.xxx.com
```

如果用户暂时没确定 → 写占位 `https://dev-api.example.com` / `https://api.example.com`，并在生成的 `.env` 里加注释「请改成实际域名」。

### 问题 6:会员管理

```
项目是否需要会员管理?(登录、注册、用户信息)
- 是 → 会自动加 Pinia (Vue) / Zustand (React) 状态管理 + 登录态相关代码
- 否 → 不加状态库,后续需要再装
```

### 问题 7:项目名 + 目录

```
项目名? (会用作 package.json 的 name 和目录名)
在哪里创建? (默认当前目录的子目录,如 ./my-app)
```

**收齐这 7 项再动手**。中途用户答得含糊（"差不多就行"）→ 推荐一个默认项让他确认，不要憋着不动。

---

## 执行：按顺序生成

### 步骤 1：脚手架初始化（用官方命令，不手搓）

按问答结果选命令：

| 框架 | 命令 |
|------|------|
| Vue3 + Vite | `npm create vue@latest <name> -- --ts --router --pinia` |
| Nuxt3 | `npx nuxi@latest init <name>` |
| React + Vite | `npm create vite@latest <name> -- --template react-ts` |
| Next.js | `npx create-next-app@latest <name> --ts --app` |
| uni-app | `npx degit dcloudio/uni-preset-vue#vite-ts <name>` |

**先在终端跑命令、装依赖**，让脚手架先自己生成基础结构，再在上面叠加自定义代码——比手写每个文件可靠得多。

如果用户的网络/权限装不动 npm → 明确告诉用户「请你手动跑 `xxx` 命令，跑完告诉我，我接着搭」。

### 步骤 2：环境变量与拦截器（核心需求 ①）

不论哪种框架，统一目录约定：

```
src/
  api/
    request.ts        # 拦截器主体
    modules/          # 各模块接口(后续业务往这里塞)
.env.development      # 开发环境变量
.env.production       # 生产环境变量
```

`.env.development`：
```
VITE_API_BASE_URL=https://dev-api.xxx.com   # Vite 项目用 VITE_ 前缀
# Nuxt 用 NUXT_PUBLIC_API_BASE
# Next 用 NEXT_PUBLIC_API_BASE
```

`.env.production` 同理换 prod 域名。

**拦截器骨架**（按框架给对应实现）：

#### Vue / Nuxt（基于 axios 或 ofetch）

`src/api/request.ts` 必须包含：

1. **创建实例 + baseURL 从 env 读**：
   ```ts
   const baseURL = import.meta.env.VITE_API_BASE_URL  // Vite
   // Nuxt 用 useRuntimeConfig().public.apiBase
   ```
2. **请求拦截器**：自动加 token（从状态库或 localStorage 取）、加 Content-Type、统一 timeout（默认 15000）。
3. **响应拦截器**：
   - 拆业务壳（`{ code, data, msg }` 这种统一返回结构）—— 注释里告诉用户这里要按后端实际结构调
   - `code !== 0`（按后端约定）→ 抛业务错误 + 统一弹 toast
   - HTTP 401 → 清登录态 + 跳登录页
   - HTTP 5xx → 提示「服务异常」
   - 网络错误 → 提示「网络异常」
4. **请求取消**：用 `AbortController`，提供 `cancelAll()` 方法（路由切换时取消上一页的未完成请求）。

#### React / Next（基于 axios）

同上，`src/api/request.ts` 用 axios。环境变量改 `NEXT_PUBLIC_API_BASE` / `import.meta.env.VITE_API_BASE_URL`。Next 项目还要注意：服务端组件可以直接 fetch、客户端组件才用拦截器；在文件里加注释说明。

#### uni-app

用 `uni.request` 自封装：在 `src/utils/request.js` 里写 `request(options)`，内部判断 `process.env.NODE_ENV === 'development'` 选域名。注意 uni-app 不能用 axios，必须 `uni.request`。

**额外**：在 `src/api/modules/example.ts` 写一个**示例接口**（如 `getUserInfo`），让用户立刻能照葫芦画瓢。

### 步骤 3：公共组件（核心需求 ②）

不论是否有会员管理，都生成这三个：

```
src/components/
  layout/
    AppHeader.vue     # 或 .tsx
    AppFooter.vue
  common/
    AppPopup.vue
```

**Header**：
- 左 logo（占位图 / 文字）+ 中导航菜单（用项目路由表数据驱动，不写死） + 右用户区
- 用户区根据「是否有会员管理」分两种：
  - 有 → 未登录显示「登录/注册」按钮，已登录显示头像 + 下拉菜单（个人中心、退出）
  - 无 → 留空或只放搜索/语言切换占位
- 移动端项目（uni-app / Vant）→ 改成顶部导航栏 + 抽屉菜单结构

**Footer**：
- 三段式：联系方式 / 友情链接 / 备案信息（占位）
- 移动端项目 → 改成 TabBar（底部导航），不是 Footer。这种情况问用户「移动端通常用 TabBar 替代 Footer，要 TabBar 吗?」

**Popup**：通用弹窗组件
- Props：`modelValue` (v-model 控制开关) / `title` / `closable` / `maskClose`
- Slots：default（内容）、`footer`（底部按钮区）
- React 版用 `open` + `onClose` 受控

每个组件要：用 `<script setup lang="ts">` (Vue) / `function` 组件 (React)，Props 带类型，emits 完整，**不要写空骨架糊弄**——至少结构、样式、基础交互都要可用。

### 步骤 4：会员状态管理（仅当问题 6 选「是」）

#### Vue / Nuxt → Pinia

```
src/stores/
  user.ts
```

`user.ts` 必须包含：

- `state`: `token`、`userInfo`（id、name、avatar 等）、`isLogin`（computed）
- `actions`:
  - `login(payload)` → 调登录接口 → 存 token + userInfo → 持久化（localStorage / Nuxt useCookie）
  - `logout()` → 清状态 + 跳登录
  - `fetchUserInfo()` → 拉用户详情
- **持久化**：用 `pinia-plugin-persistedstate`（Vue）或 `useCookie`（Nuxt SSR 友好），自动装上
- **拦截器联动**：在 `request.ts` 里 import 这个 store，自动取 token 加到 header

#### React / Next → Zustand

```
src/stores/
  user.ts
```

用 Zustand + persist middleware，结构同上。注意 Next 服务端组件不能用 client store，要在文件顶部加 `'use client'`。

#### uni-app → Pinia 或 vuex

uni-app 通常用 Pinia，结构同 Vue 版，持久化改用 `uni.setStorageSync`。

**登录页骨架**：顺手生成 `src/pages/login/index.vue` (或 `app/login/page.tsx`)，包含手机号 + 密码两个输入 + 提交按钮 + 调 store.login。**别只生成 store 不生成页面**——用户拿到要立刻能跑通登录流程。

### 步骤 5：路由与基础页面

- Vue3 → 在 `router/index.ts` 加 `/`、`/login`（如果有会员）、`/404` 三条
- Next.js → 在 `app/` 下建 `page.tsx`、`login/page.tsx`、`not-found.tsx`
- 加路由守卫：有会员管理时，默认所有页面要登录（除 `/login`、`/register`）；没会员管理则不加守卫

### 步骤 6：跑一遍验证

```
1. cd <project> && npm install (脚手架已装的话跳过)
2. npm run dev
3. 访问 dev server 看页面正常显示
4. 看 Network 面板,确认请求拦截器在工作(可以用 mock 接口或让 console.log 在拦截器里打点)
```

**起不起来**就明说，不要谎报「项目已就绪」。

---

## 完成后的报告

```
✅ 项目 {名称} 已初始化完成

📦 技术栈
  框架: {Vue3 / Nuxt3 / React / Next / uni-app}
  语言: {TS / JS}
  样式: {Sass / Tailwind / ...}
  UI 库: {Element Plus / Ant Design / 无}
  状态管理: {Pinia / Zustand / 无}

📁 关键文件
  src/api/request.ts        — 拦截器(双域名通过 .env 切换)
  src/api/modules/example.ts — 接口示例
  src/components/layout/    — Header / Footer
  src/components/common/AppPopup.vue — 通用弹窗
  src/stores/user.ts        — 登录态(如果选了会员管理)
  .env.development / .env.production — 域名配置

🚀 启动
  cd {项目目录}
  npm run dev → http://localhost:5173

⚠️ 还要你做的
  1. 改 .env.development / .env.production 里的域名为实际地址
  2. 拦截器里的业务壳判断({ code, data, msg })按后端实际结构调
  3. Header/Footer 里的 logo、导航、备案信息替换占位内容
```

让用户清楚：**做了什么、什么需要他后续动手补**。

---

## 铁律

1. **先问全再动手**——7 个问题没收齐就开干 = 重做，浪费时间。
2. **优先用官方脚手架**——`npm create vue` / `npx create-next-app`，不要纯手写所有文件。
3. **拦截器是骨架不是成品**：业务壳（`code/data/msg`）的判断逻辑用注释标明「按后端实际结构调」，不假设。
4. **公共组件要可用**：Header/Footer/Popup 不要交付"空 div"，至少结构 + 样式 + 基础交互完整。
5. **会员管理选了「无」就别多事**：不要"为了将来扩展方便"硬塞 Pinia——YAGNI。
6. **不引超出问答范围的依赖**：用户没说要 i18n 就不装；没说要图表就不装。
