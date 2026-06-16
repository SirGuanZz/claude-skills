---
name: fe-project-init
description: >-
  从 0 开始创建前端项目骨架,按问答确定技术栈,自动生成多域名接口拦截器(开发/生产环境变量)、
  公共 Header/Footer/Popup 组件,可选会员状态管理。
  Use when the user says "新建项目", "创建项目", "起一个项目", "从零搭项目",
  "初始化项目", "搭个前端架子", or /fe-project-init.
  答完 7 个问题后自动一口气执行到底,不再二次确认。
---

# fe-project-init: 前端项目从零初始化

职责：从 0 起一个能立即跑起来的前端项目骨架，覆盖技术栈选型 → 多域名拦截器（dev/prod 环境变量 + npm 命令切换）→ 公共组件 → 可选会员状态管理。

**核心纪律**：**只问 7 个问题，答完立刻一口气跑到底**——脚手架、装依赖、写代码、跑 `dev` 验证，全程不暂停、不二次确认、不「要我继续吗」。只有 npm 权限/网络导致命令实在跑不通时，才停下来告诉用户缺什么。

---

## 启动：问答收集需求（只此一轮，答完即开工）

进入 skill 后，**用 `AskUserQuestion` 一次发问、收齐 7 项核心信息**。

**答完问题的同一轮回复里就开始执行步骤 1~6**，不要等用户说「开始吧」「继续」。中间**禁止**再 AskUserQuestion / 文字确认，包括但不限于：
- 「确认一下用 Element Plus 吗?」
- 「Header 导航写哪几个?」
- 「要我继续生成组件吗?」
- 「npm 装好了,接下来…」

信息不全或用户答得含糊 → **按下方默认值自行决断**,写进最终报告即可,不要回头问。

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

### 问题 5:接口域名（多域名）

```
项目有几个接口域名? 请列出名称 + dev/prod 两套地址。

常见命名示例:
- main   主业务 API   dev: https://dev-api.xxx.com    prod: https://api.xxx.com
- user   用户中心     dev: https://dev-user.xxx.com   prod: https://user.xxx.com
- upload 上传/文件     dev: https://dev-upload.xxx.com prod: https://upload.xxx.com

至少 1 个,通常 2~4 个。名称用英文小写(main/user/upload/cms 等),会转成环境变量和代码常量。
```

用户只给 1 个域名 → 用 `main` 作为唯一 key。用户暂时没确定 → 生成 2 个占位域名(`main` + `user`),`.env` 里写 `https://dev-api.example.com` 等并加注释「请改成实际域名」。

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

### 默认值（用户没说清时直接用,不追问）

| 项 | 默认 |
|----|------|
| 语言 | TypeScript |
| 样式 | Sass / SCSS |
| UI 库 | Vue3/Nuxt → Element Plus；React/Next → 无；uni-app → uni-ui |
| 域名 | `main` + `user` 两个占位域名 |
| 项目目录 | 当前工作区下的 `./<项目名>` |
| 移动端 Footer | uni-app / Vant → 自动生成 TabBar,不生成 Footer |

**7 项收齐（或缺项已填默认）→ 立即进入执行,不停顿。**

---

## 执行：一口气跑到底（步骤 1→6 连续完成）

**执行模式**：自己在终端跑命令、写文件、装包、修报错,直到步骤 6 验证通过或遇到无法绕过的阻塞。每完成一步 silently 进入下一步,不要向用户汇报进度卡点。

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

脚手架命令尽量**非交互**（加 `--yes` / 默认值 flag）,避免卡在终端提问:

| 框架 | 非交互要点 |
|------|-----------|
| Vue3 + Vite | `-- --ts --router --pinia --eslint-with-prettier` 等全用 flag,不传则按问答结果补 |
| Nuxt3 | `nuxi init` 后自动改配置,不等人选 template |
| React + Vite | `--template react-ts` |
| Next.js | `--yes` 或全 flag:`--ts --eslint --tailwind --app --src-dir --import-alias "@/*"` |
| uni-app | degit 无交互 |

命令失败 → **先自行重试**（换镜像、`--legacy-peer-deps`、删 lock 重装）,仍不行才停下说明阻塞点;**不要**问「要我重试吗」。

### 步骤 2：环境变量、域名配置与拦截器（核心需求 ①）

#### 2.1 目录约定

```
src/
  config/
    env.ts              # 域名常量,页面/组件可直接 import
  api/
    request.ts          # 拦截器工厂 + 各域名实例
    modules/            # 各模块接口(后续业务往这里塞)
.env.development        # 开发环境变量
.env.production         # 生产环境变量
.env.example            # 模板(不含真实密钥,提交 git)
```

#### 2.2 环境变量命名规则

按问题 5 收集的域名 key 生成变量,**统一大写 + `API_` 前缀**:

| 域名 key | Vite 变量 | Nuxt 变量 | Next 变量 |
|----------|-----------|-----------|-----------|
| `main` | `VITE_API_MAIN` | `NUXT_PUBLIC_API_MAIN` | `NEXT_PUBLIC_API_MAIN` |
| `user` | `VITE_API_USER` | `NUXT_PUBLIC_API_USER` | `NEXT_PUBLIC_API_USER` |
| `upload` | `VITE_API_UPLOAD` | `NUXT_PUBLIC_API_UPLOAD` | `NEXT_PUBLIC_API_UPLOAD` |

`.env.development` 示例（假设有 main / user 两个域名）:

```env
# 开发环境 — npm run dev / npm run dev:prod 的 --mode development 会读此文件
VITE_API_MAIN=https://dev-api.example.com
VITE_API_USER=https://dev-user.example.com
```

`.env.production` 示例:

```env
# 生产环境 — npm run build / npm run dev:prod 会读此文件
VITE_API_MAIN=https://api.example.com
VITE_API_USER=https://user.example.com
```

`.env.example` 只列 key 不写真实地址,方便团队 onboarding。

**Nuxt3**：在 `nuxt.config.ts` 的 `runtimeConfig.public` 里映射上述变量,`env.ts` 从 `useRuntimeConfig().public` 读。**Next.js**：客户端从 `process.env.NEXT_PUBLIC_*` 读;服务端组件用 `$fetch` 直连,客户端组件走拦截器——文件里加注释说明。

#### 2.3 npm scripts（dev / prod 命令切换）

在 `package.json` 写入以下 scripts（按框架微调命令,但**语义保持一致**）:

| 命令 | 作用 | 读取的环境文件 |
|------|------|----------------|
| `npm run dev` | 本地开发,热更新 | `.env.development` |
| `npm run dev:prod` | 本地开发,但连**生产域名**（联调 prod 接口时用） | `.env.production` |
| `npm run build` | 打生产包 | `.env.production` |
| `npm run build:dev` | 打开发包（少见,CI 测 dev 环境用） | `.env.development` |
| `npm run preview` | 预览 build 产物 | 跟随 build 时的 mode |

**Vite / Vue3 / React** 的 scripts 模板:

```json
{
  "scripts": {
    "dev": "vite",
    "dev:prod": "vite --mode production",
    "build": "vite build --mode production",
    "build:dev": "vite build --mode development",
    "preview": "vite preview"
  }
}
```

**Nuxt3**:

```json
{
  "scripts": {
    "dev": "nuxt dev --dotenv .env.development",
    "dev:prod": "nuxt dev --dotenv .env.production",
    "build": "nuxt build --dotenv .env.production",
    "build:dev": "nuxt build --dotenv .env.development",
    "preview": "nuxt preview"
  }
}
```

**Next.js**（Next 默认按 `NODE_ENV` 读 `.env.development` / `.env.production`;`dev:prod` 用 `dotenv-cli` 或 `env-cmd` 加载 prod env）:

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:prod": "env-cmd -f .env.production next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

若 Next 项目用了 `env-cmd`,顺手装上 `env-cmd` 依赖并在报告里说明。

#### 2.4 域名常量 `src/config/env.ts`（页面可直接用）

**必须生成**,让页面/组件能 `import { API_BASE, APP_ENV } from '@/config/env'` 拿到当前环境的域名,不必自己拼 `import.meta.env`。

Vite 项目模板:

```ts
/** 当前运行模式: development | production */
export const APP_ENV = import.meta.env.MODE

/** 是否开发环境(连 dev 域名) */
export const IS_DEV = import.meta.env.DEV

/** 各接口域名 — key 与 .env 中 VITE_API_* 对应 */
export const API_BASE = {
  main: import.meta.env.VITE_API_MAIN as string,
  user: import.meta.env.VITE_API_USER as string,
  // ...按问答收集的域名 key 展开
} as const

export type ApiBaseKey = keyof typeof API_BASE

/** 取单个域名,页面拼静态资源/CDN 链接时用 */
export function getApiBase(key: ApiBaseKey): string {
  const url = API_BASE[key]
  if (!url) {
    throw new Error(`[env] 缺少 API 域名: ${key},请检查 .env 是否配置了 VITE_API_${key.toUpperCase()}`)
  }
  return url
}
```

启动时在 `main.ts` / `app.vue` 加一行 `console.info('[env]', APP_ENV, API_BASE)`（仅 dev 模式）,方便确认当前连的是哪套域名。

#### 2.5 拦截器 `src/api/request.ts`

**不要**只做一个全局 axios 实例绑死一个 baseURL。用**工厂函数 + 多实例**:

```ts
import axios, { type AxiosInstance } from 'axios'
import { API_BASE, type ApiBaseKey, getApiBase } from '@/config/env'

function createRequest(baseKey: ApiBaseKey): AxiosInstance {
  const instance = axios.create({
    baseURL: getApiBase(baseKey),
    timeout: 15000,
  })
  // 请求拦截: token、Content-Type
  // 响应拦截: 业务壳、401、5xx、网络错误
  return instance
}

/** 各域名对应的请求实例 — 业务模块 import 对应实例即可 */
export const mainRequest = createRequest('main')
export const userRequest = createRequest('user')
// export const uploadRequest = createRequest('upload')

/** 路由切换时取消所有未完成请求 */
const pendingControllers = new Set<AbortController>()
export function cancelAllRequests() { /* AbortController 实现 */ }

/** 也可按 key 动态取实例 */
export function getRequest(baseKey: ApiBaseKey) {
  const map = { main: mainRequest, user: userRequest } as const
  return map[baseKey]
}
```

每个实例共享同一套拦截器逻辑（token、错误处理）,仅 `baseURL` 不同。

**必须包含**:

1. **baseURL 从 `getApiBase(key)` 读**,不硬编码域名
2. **请求拦截器**: 自动加 token、Content-Type、timeout 15000
3. **响应拦截器**:
   - 拆业务壳（`{ code, data, msg }`）—— 注释标明「按后端实际结构调」
   - `code !== 0` → 抛业务错误 + toast
   - HTTP 401 → 清登录态 + 跳登录
   - HTTP 5xx → 「服务异常」; 网络错误 → 「网络异常」
4. **请求取消**: `AbortController` + `cancelAll()`

#### 2.6 各框架差异

| 框架 | 拦截器实现 | 备注 |
|------|-----------|------|
| Vue3 + Vite | axios + 上节结构 | 装 `axios`,路径别名 `@/` |
| Nuxt3 | `$fetch` 封装或 axios | `env.ts` 用 composable 包一层 `useApiBase()`,SSR 安全 |
| React + Vite | 同 Vue | hooks 里 import `API_BASE` |
| Next.js | axios,客户端组件 | 文件顶加 `'use client'`; RSC 用原生 fetch |
| uni-app | `uni.request` 封装 | 放 `src/utils/request.ts`; 按 key 选 baseURL; 不能用 axios |

**uni-app** 额外在 `src/config/env.ts` 里:

```ts
const isDev = process.env.NODE_ENV === 'development'
export const API_BASE = {
  main: isDev ? 'https://dev-api.example.com' : 'https://api.example.com',
  // ...
}
```

uni-app 无 Vite mode 时,dev/prod 靠 HBuilderX / 微信开发者工具的运行模式切换;scripts 里保留 `dev` / `build` 即可。

#### 2.7 示例接口

`src/api/modules/example.ts` 写**两个示例**,展示不同域名实例的用法:

```ts
import { mainRequest, userRequest } from '@/api/request'

/** 主业务域 — 首页列表 */
export function getHomeList() {
  return mainRequest.get('/home/list')
}

/** 用户域 — 用户信息 */
export function getUserInfo() {
  return userRequest.get('/user/info')
}
```

首页或示例页 import `API_BASE`,在模板里展示当前环境域名（仅 dev 调试用,上线前可删）。

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
- 移动端项目（uni-app / Vant）→ **自动**生成 TabBar 替代 Footer,不询问

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
- **拦截器联动**：在 `request.ts` 工厂函数的请求拦截里取 token,**所有域名实例**自动带上

登录接口走 `userRequest`,注册/用户信息等同域接口也走对应实例。

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
- 路由 `beforeEach` 里调用 `cancelAllRequests()`（如果有）

### 步骤 6：自行跑验证（Agent 在终端执行,不要甩给用户）

**必须自己在终端跑**,全部通过后再出最终报告:

```
1. cd <project> && npm install
2. npm run dev — 确认进程能起来、无编译错误(看终端输出,不必真开浏览器)
3. npm run build — 确认生产构建通过
4. (可选) npm run dev:prod — 确认 prod mode 能启动
```

验证点:
- 终端无 TS/编译报错
- `console.info('[env]', …)` 或 build 日志里 env 变量已注入
- 缺 env 会在 build 阶段暴露,当场修 `.env` / `env.ts` 再重跑

**起不来** → 自行修到能 build 为止;实在阻塞(如无 node/npm)才在报告里说明,不要谎报「项目已就绪」。

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

🌐 接口域名
  main  → dev: {dev-main}  /  prod: {prod-main}
  user  → dev: {dev-user}  /  prod: {prod-user}
  (按实际收集的 key 列出)

📁 关键文件
  src/config/env.ts           — 域名常量,页面直接 import { API_BASE }
  src/api/request.ts          — 多实例拦截器(mainRequest / userRequest / ...)
  src/api/modules/example.ts  — 跨域名调用示例
  src/components/layout/      — Header / Footer
  src/components/common/AppPopup.vue — 通用弹窗
  src/stores/user.ts          — 登录态(如果选了会员管理)
  .env.development / .env.production / .env.example

🚀 启动
  cd {项目目录}
  npm run dev       → 本地开发,连 dev 域名
  npm run dev:prod  → 本地开发,连 prod 域名(联调用)
  npm run build     → 打生产包

⚠️ 还要你做的
  1. 改 .env.development / .env.production 里的域名为实际地址
  2. 拦截器里的业务壳判断({ code, data, msg })按后端实际结构调
  3. 新增业务域时在 .env、env.ts、request.ts 三处同步加 key
  4. Header/Footer 里的 logo、导航、备案信息替换占位内容

📋 自动采用的默认值(若你未指定)
  {列出用了哪些默认: UI 库 / 样式 / 域名占位 / 目录 等}
```

**只在全部步骤跑完后输出这一份报告**。让用户清楚：**做了什么、什么需要他后续动手补、哪些项用了默认**。

---

## 铁律

1. **只问 7 个问题,答完一口气跑到底**——中间任何确认、进度汇报、分步交付 = 违规。最终只输出一次完成报告。
2. **缺信息用默认值,不回头问**——见「默认值」表;报告里注明「未指定,已用默认 xxx」即可。
3. **优先用官方脚手架**——`npm create vue` / `npx create-next-app`，不要纯手写所有文件。
4. **多域名三件套必须齐**——`.env` 变量 + `config/env.ts` 常量 + `request.ts` 多实例,缺任何一个不算完成。
5. **dev/prod 命令必须可跑**——Agent 自己跑 `npm run dev` + `npm run build` 验证通过再交付。
6. **拦截器是骨架不是成品**：业务壳（`code/data/msg`）的判断逻辑用注释标明「按后端实际结构调」，不假设。
7. **公共组件要可用**：Header/Footer/Popup 不要交付"空 div"，至少结构 + 样式 + 基础交互完整。
8. **会员管理选了「无」就别多事**：不要"为了将来扩展方便"硬塞 Pinia——YAGNI。
9. **不引超出问答范围的依赖**：用户没说要 i18n 就不装；没说要图表就不装。
