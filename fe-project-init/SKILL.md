---
name: fe-project-init
description: >-
  从 0 开始创建前端项目骨架,按问答确定技术栈与端(PC/移动/小程序),自动生成多域名拦截器、
  设计稿适配、Layout/公共组件,可选会员状态管理。
  Use when the user says "新建项目", "创建项目", "起一个项目", "从零搭项目",
  "初始化项目", "搭个前端架子", or /fe-project-init.
  答完 8 个问题后自动一口气执行到底,不再二次确认。
---

# fe-project-init: 前端项目从零初始化

职责：从 0 起一个能立即跑起来的前端项目骨架，覆盖端适配 → 多域名拦截器 → Layout/公共组件 → 路由 → 验证。

**核心纪律**：**只问 8 个问题，答完立刻一口气跑到底**——脚手架、装依赖、写代码、`dev` + `build` + 类型检查，全程不暂停、不二次确认。只有 npm 权限/网络实在跑不通时才停。

---

## 框架 × 端 决策表（问答结束后按此执行,冲突时以问题 2「端」为准）

| 端 | 允许框架 | 自动修正 | UI 库默认 | 样式默认 | 单位 |
|----|---------|---------|----------|---------|------|
| PC | Vue3+Vite / Nuxt3 / React+Vite / Next | 端=PC 时禁止 uni-app / 原生小程序 | Vue→Element Plus; React→无 | Sass | px, 主体 1200 |
| 移动 H5 | Vue3+Vite / Nuxt3 | 端=移动 时框架应为 Vue 系;若选了 Next 改为 Vue3+Vite | Vant | Sass | Sass→px 转 rem; Tailwind→rem 配置 |
| 小程序 | uni-app / 原生微信小程序 | 端=小程序 时框架必须是 uni-app 或原生,其他一律改 uni-app | uni-ui | Sass 或 CSS | rpx |

**Pinia / Zustand**：仅问题 7 选「是」时装;脚手架命令里的 `--pinia` 同理,没会员就不加。

**Tailwind / UnoCSS + 移动 H5**：**禁止** postcss-pxtorem;改 Tailwind `theme.extend` 按 750 设计稿配 spacing/fontSize,或用 `rem` 单位直接写。

---

## 启动：问答收集需求（只此一轮,答完即开工）

用 `AskUserQuestion` **一次**收齐 8 项。答完**同一轮**开始执行,禁止再确认。

信息不全 → 用「默认值」表 + 决策表,写进最终报告。

### 问题 1：框架与渲染模式

```
Vue3 + Vite (SPA) / Nuxt3 (SSR) / React + Vite / Next.js / uni-app / 原生微信小程序
```

与问题 2 冲突时,**以问题 2 为准**自动修正(见决策表),不回头问。  
若问题 2 已选「小程序」,本题可忽略,最终会改为 uni-app 或原生微信。

### 问题 2：端类型（PC / 移动 / 小程序）

```
PC       — 设计稿 1920,主体 1200 居中,px
移动 H5   — 设计稿 750,Sass 写 px 自动转 rem / Tailwind 配 rem
小程序    — 设计稿 750,单位 rpx
```

### 问题 3：语言

TypeScript(默认) / JavaScript

### 问题 4：样式方案

Sass / SCSS(默认) / CSS / Tailwind CSS / UnoCSS

### 问题 5：UI 组件库

按决策表默认;用户指定则覆盖。

### 问题 6：接口域名（多域名）

名称 + dev/prod 两套地址。至少 1 个,通常 2~4 个(key: main/user/upload…)。未提供 → `main` + `user` 占位域名。

### 问题 7：会员管理

是 → Pinia(Vue) / Zustand(React) + 登录页 + 路由守卫  
否 → 不加状态库

### 问题 8：项目名 + 目录

项目名 + 创建路径(默认 `./<项目名>`)

### 默认值

| 项 | 默认 |
|----|------|
| 端 | PC |
| 语言 | TypeScript |
| 样式 | Sass |
| UI 库 | 见决策表 |
| 域名 | main + user 占位 |
| 目录 | `./<项目名>` |
| 包管理器 | npm(失败可试 pnpm) |

---

## 执行清单（Agent 必须逐项完成,全部 ✓ 后再出报告）

```
□ 1. 脚手架非交互跑通 + npm install
□ 2. .gitignore 含 .env.local / dist
□ 3. config/design.ts 与端一致
□ 4. 端适配: PC→layout 1200 | 移动 Sass→flexible+pxtorem+.mobile-container | 移动 Tailwind/UnoCSS→无 pxtorem | 小程序→rpx
□ 5. .env.example + .env.development/.production(占位);真实密钥仅 .env.local
□ 6. config/env.ts + types/api.d.ts + utils/message.ts
□ 7. api/request.ts 多实例 + dev proxy(H5 Vite/Nuxt) 或直连(小程序)
□ 8. UI 库已安装且已在 main.ts / nuxt.config / app.json 注册
□ 9. layouts + Header/Footer 或 TabBar
□ 10. 路由(按框架: router / pages / pages.json / app.json)
□ 11. 会员模块(若选是)
□ 12. 项目 README.md(短)
□ 13. npm run dev + npm run build + 类型检查通过
```

---

## 步骤 1：脚手架 + 基础工程

### 1.1 脚手架命令

| 框架 | 命令 | 备注 |
|------|------|------|
| Vue3 + Vite | `npm create vue@latest <name> -- --ts --router [--pinia]` | `--pinia` 仅会员=是 |
| Nuxt3 | `npx nuxi@latest init <name>` | 后续加 pinia module(若会员=是) |
| React + Vite | `npm create vite@latest <name> -- --template react-ts` | |
| Next.js | `npx create-next-app@latest <name> --yes --ts --eslint --app --src-dir --import-alias "@/*"` | tailwind 与问题4冲突时去掉 --tailwind |
| uni-app | `npx degit dcloudio/uni-preset-vue#vite-ts <name>` | |
| 原生微信小程序 | 建标准目录 + `project.config.json` + `app.json` | 无 npm 脚手架时用最小结构 |

非交互 flag 用尽;失败 → 换镜像 / `--legacy-peer-deps` / 删 lock 重装,仍失败才停。

### 1.2 `.gitignore`（立刻补）

```
node_modules
dist
.DS_Store
*.local
.env.local
.env.*.local
```

`.env.example` — **提交 git**,只列 key 与占位 URL,供团队复制。  
`.env.development` / `.env.production` — 可提交,但**只用占位域名**,不要写密钥/内网地址。  
`.env.local` / `.env.*.local` — **不提交**,放真实域名、token、密钥(Vite/Nuxt/Next 会自动 merge)。

加载顺序(Vite):`.env` → `.env.[mode]` → `.env.local` → `.env.[mode].local`(后者覆盖前者)。

### 1.3 依赖（按端/框架按需装,不超额）

| 用途 | 包 |
|------|-----|
| 请求 | axios(Vue/React/Next); uni-app 用 uni.request |
| 移动 rem(Sass) | postcss postcss-pxtorem |
| UI | element-plus / vant / @nuxt/ui 等 |
| 会员持久化 | pinia-plugin-persistedstate / zustand persist |
| Next dev:prod | env-cmd |
| 类型检查 | vue-tsc(Vue) / tsc(React) |

### 1.4 UI 库注册（装完必须能用,不只装包）

| 框架 | UI 库 | 注册方式 |
|------|-------|---------|
| Vue3 + Vite | Element Plus | `main.ts`:`app.use(ElementPlus)` + `import 'element-plus/dist/index.css'`;或 `@element-plus/icons-vue` 按需 |
| Vue3 + Vite | Vant(移动) | `app.use(Vant)` + `import 'vant/lib/index.css'`;或 `unplugin-vue-components` + `VantResolver` |
| Nuxt3 | Element Plus | `@element-plus/nuxt` module 或 plugins/element-plus.client.ts |
| Nuxt3 | Vant | `@vant/nuxt` 或 client plugin |
| React | Ant Design | `ConfigProvider` 包根组件 + `import 'antd/dist/reset.css'` |
| uni-app | uni-ui | `pages.json` easycom 或手动 import 组件 |

**验证**:首页或 Header 里放一个 UI 库按钮(如 `<el-button>` / `<van-button>`),build 通过且组件非裸 HTML。

---

## 步骤 2：端适配与设计稿

### 2.1 `src/config/design.ts`

```ts
export type Platform = 'pc' | 'mobile' | 'miniprogram'

export const DESIGN = {
  platform: 'pc' as Platform,
  designWidth: 1920,      // PC:1920 | 移动&小程序:750
  contentWidth: 1200,     // 仅 PC;其他 undefined
  unit: 'px' as 'px' | 'px→rem' | 'rpx' | 'tailwind-rem',
} as const
```

### 2.2 PC（1920 / 主体 1200）

`src/styles/layout.scss`:

```scss
$content-width: 1200px;
.page-wrapper { width: 100%; min-height: 100vh; }
.page-container {
  width: 100%; max-width: $content-width; margin: 0 auto;
  padding: 0 16px; box-sizing: border-box;
}
```

不装 postcss-pxtorem。

### 2.3 移动 H5 + Sass（750 → rem）

**postcss.config.js** — `rootValue: 75`; `selectorBlackList: ['.norem', /^\.van-/]`(Vant 不转换)

**src/utils/flexible.ts** — 根字号 `75 * (clientWidth / 750)`;宽屏策略:**内容区 max-width 750px 水平居中**,避免 iPad 上 UI 过大:

```ts
const BASE = 75
function setRootFontSize() {
  const cw = document.documentElement.clientWidth
  const vw = Math.min(cw, 750)
  document.documentElement.style.fontSize = `${(vw / 750) * BASE}px`
}
```

`main.ts` 最顶部 `import '@/utils/flexible'`。

**index.html** 加:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
```

`variables.scss` 注释:设计稿多少 px 写多少 px。

**layout.scss 追加** — 宽屏内容区封顶居中(与 flexible 配合):

```scss
.mobile-wrapper {
  width: 100%;
  min-height: 100vh;
  margin: 0 auto;
}
.mobile-container {
  width: 100%;
  max-width: 750px;
  margin: 0 auto;
  box-sizing: border-box;
}
```

DefaultLayout 移动 H5:`.mobile-wrapper` > Header + `<main class="mobile-container">` + TabBar。

### 2.4 移动 H5 + Tailwind / UnoCSS

- **不装** postcss-pxtorem(UnoCSS 同 Tailwind 处理)
- Tailwind:`tailwind.config` → `screens: { sm: '750px' }`;spacing/fontSize 按 750 稿扩展
- UnoCSS:`uno.config.ts` → `theme` 里按 750 定义 spacing/fontSize,或直接用 rem 值
- 同样加 `.mobile-container { max-width:750px }` 居中
- `DESIGN.unit = 'tailwind-rem'`(UnoCSS 也用此值)

### 2.5 小程序（750 / rpx）

- 样式全用 `rpx`(设计稿 32px → `32rpx`)
- **禁止** postcss-pxtorem
- TabBar / 导航 → `pages.json`(uni-app) 或 `app.json`(原生)

---

## 步骤 3：环境变量、类型、拦截器、Proxy

### 3.1 目录

```
src/
  config/env.ts
  config/design.ts
  types/api.d.ts
  utils/message.ts
  api/request.ts
  api/modules/example.ts
.env.development
.env.production
.env.example
```

### 3.2 环境变量

key → `VITE_API_<KEY>` / `NUXT_PUBLIC_API_<KEY>` / `NEXT_PUBLIC_API_<KEY>`

| 文件 | 读取时机 | 内容 |
|------|---------|------|
| `.env.development` | `npm run dev` / `build:dev` | 占位 dev 域名 |
| `.env.production` | `npm run dev:prod` / `npm run build` | 占位 prod 域名 |
| `.env.local` | 所有 mode,优先级最高 | 真实域名/密钥(不提交) |

`.env.example` 示例:

```env
VITE_API_MAIN=https://dev-api.example.com
VITE_API_USER=https://dev-user.example.com
# 复制为 .env.local 并改成真实地址
```

### 3.3 npm scripts

**Vue3 / React (Vite)**:

```json
{
  "scripts": {
    "dev": "vite",
    "dev:prod": "vite --mode production",
    "build": "vite build --mode production",
    "build:dev": "vite build --mode development",
    "preview": "vite preview",
    "typecheck": "vue-tsc --noEmit"
  }
}
```

React 项目把 `typecheck` 改为 `"tsc -b"`。

**Nuxt3**:

```json
{
  "scripts": {
    "dev": "nuxt dev --dotenv .env.development",
    "dev:prod": "nuxt dev --dotenv .env.production",
    "build": "nuxt build --dotenv .env.production",
    "build:dev": "nuxt build --dotenv .env.development",
    "preview": "nuxt preview",
    "typecheck": "nuxt typecheck"
  }
}
```

**Next.js**:

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:prod": "env-cmd -f .env.production next dev",
    "build": "next build",
    "start": "next start",
    "typecheck": "tsc --noEmit"
  }
}
```

Next 需装 `env-cmd`(devDependency)。

### 3.4 `src/types/api.d.ts`

```ts
/** 业务响应壳 — 按后端实际结构调整 */
export interface ApiResponse<T = unknown> {
  code: number
  data: T
  msg: string
}

export interface PageResult<T> {
  list: T[]
  total: number
}
```

### 3.5 `src/config/env.ts`

导出 `APP_ENV`、`IS_DEV`、`API_BASE`、`getApiBase(key)`;dev 模式 `console.info('[env]', APP_ENV, API_BASE)`。

Nuxt → `runtimeConfig.public` + composable;uni-app → 按 NODE_ENV 选 dev/prod 域名。

### 3.6 `src/utils/message.ts`

按 UI 库封装,供拦截器调用:

```ts
// Vue + Element Plus → ElMessage
// 移动 Vant → showToast
// 无 UI 库 → console.warn
export function showError(msg: string) { /* ... */ }
export function showSuccess(msg: string) { /* ... */ }
```

### 3.7 `src/api/request.ts`

- 工厂 `createRequest(baseKey)` → `mainRequest` / `userRequest` / …
- 请求拦截:token、Content-Type、timeout 15000、AbortController
- 响应拦截:解 `ApiResponse<T>`;`code !== 0` → `showError` + reject;401 → 清登录态 + 跳登录;5xx/网络 → `showError`
- `cancelAllRequests()` 供路由切换调用

### 3.8 Dev Proxy / CORS（按框架,仅 H5 本地开发）

**Vue3 / React (Vite)** — `vite.config.ts`:

```ts
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    server: {
      proxy: {
        '/api-main': {
          target: env.VITE_API_MAIN,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api-main/, ''),
        },
        // 每个 API key 一条: /api-user → VITE_API_USER
      },
    },
  }
})
```

**Nuxt3** — `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  runtimeConfig: { public: { apiMain: process.env.NUXT_PUBLIC_API_MAIN } },
  nitro: {
    devProxy: {
      '/api-main': { target: process.env.NUXT_PUBLIC_API_MAIN, changeOrigin: true },
    },
  },
})
```

**Next.js** — `next.config.ts` 的 `rewrites`(或 dev 时用 env-cmd 直连,proxy 可选)。

**uni-app / 原生微信小程序** — **不配 dev proxy**。`request` 直连 `getApiBase(key)`;本地调试:
- 微信开发者工具 → 详情 → 不校验合法域名
- 报告里提醒:上线前在小程序后台配置 request 合法域名

**request.ts baseURL 策略(H5)**:

```ts
baseURL: import.meta.env.DEV ? '/api-main' : getApiBase('main')
// 每个 key 对应 /api-{key};生产环境走 getApiBase
```

报告里说明 proxy 路径与 .env 域名对应关系。

### 3.9 示例接口 `api/modules/example.ts`

跨域名示例 + 返回类型 `Promise<ApiResponse<UserInfo>>`。

---

## 步骤 4：Layout 与公共组件

### 4.1 目录

```
src/
  layouts/
    DefaultLayout.vue    # 或 DefaultLayout.tsx / Nuxt layouts/default.vue
  components/
    layout/AppHeader.vue
    layout/AppFooter.vue   # PC only
    common/AppPopup.vue
```

### 4.2 `DefaultLayout`

- PC:`.page-wrapper` > Header + `<main class="page-container"><slot/></main>` + Footer
- 移动 H5:`.mobile-wrapper` > Header + `<main class="mobile-container"><slot/></main>` + TabBar(无 Footer)
- 小程序:多数页面用原生导航;自定义页包一层 rpx 容器

### 4.3 Header / Footer / Popup

| 端 | Header | Footer |
|----|--------|--------|
| PC | 1200 居中,logo+路由导航+用户区 | 1200 三段式占位 |
| 移动 H5 | 顶栏 px→rem / Tailwind class | TabBar,无 Footer |
| 小程序 | 原生或 rpx 自定义顶栏 | TabBar in pages.json |

Popup:`v-model` / `title` / slots;尺寸跟端走。

会员=是:Header 右侧登录/注册或头像下拉。

---

## 步骤 5：会员管理（仅问题 7 = 是）

```
src/stores/user.ts
```

state:`token`、`userInfo`、`isLogin`;actions:`login` / `logout` / `fetchUserInfo`;持久化 localStorage / useCookie(Nuxt) / uni.setStorageSync。

登录页 + 拦截器所有实例自动带 token。登录接口走 `userRequest`。

---

## 步骤 6：路由与基础页面

### Vue3 + Vite

`router/index.ts`:`/`、`/login`(会员)、`/404`;`beforeEach` 鉴权 + `cancelAllRequests()`;页面用 DefaultLayout。

### Nuxt3

`pages/index.vue`、`pages/login.vue`(会员)、`error.vue`;会员 → `middleware/auth.ts` + `definePageMeta`;`nuxt.config` css 引入 layout.scss。

### uni-app

`pages.json`:pages + tabBar(移动/小程序);`pages/index/index.vue` 等;登录页路径与 tabBar 互斥。

### 原生微信小程序

```
miniprogram/
  app.js / app.json / app.wxss
  sitemap.json
  project.config.json
  utils/request.js          # uni.request 同款封装,按 key 选 baseURL
  config/env.js             # dev/prod 域名(或读 ext 配置)
  pages/index/index.{wxml,wxss,js,json}
  pages/login/...(会员时)
```

`app.json`:pages + tabBar;`utils/request.js` 封装 token / 业务壳 / 401;本地调试勾选「不校验合法域名」。

### React + Vite

`react-router-dom`;布局路由嵌套 DefaultLayout。

### Next.js App Router

`app/layout.tsx` 包 DefaultLayout;`app/page.tsx`、`app/login/page.tsx`、`app/not-found.tsx`;客户端组件加 `'use client'`。

首页 dev 模式可展示 `API_BASE` + `DESIGN`,**必须用** `if (import.meta.env.DEV)` 包裹,避免生产环境泄露。

---

## 步骤 7：项目 README.md

生成 **20~40 行**项目内 README(不是 skill 文档):

```markdown
# {项目名}
## 启动
npm run dev / dev:prod / build
## 设计稿
PC 1920 主体 1200 | 移动 750 px→rem | 小程序 rpx
## 接口域名
main / user → 见 .env.example;真实地址复制到 .env.local
## 新增域名
.env.example + .env.local + env.ts + request.ts + dev proxy(H5) 同步
## 小程序调试
开发者工具勾选不校验合法域名;上线配置 request 合法域名
## 后续
业务组件用 vue-component-gen,会读 config/design.ts 与 config/env.ts
```

---

## 步骤 8：验证（Agent 终端执行）

```bash
cd <project>
npm install
npm run dev        # 确认无编译错误
npm run build      # 确认生产构建
npm run typecheck  # 或 nuxi typecheck / tsc -b,按框架
```

**抽查**:

| 端 | 检查 |
|----|------|
| PC | layout 含 max-width:1200px |
| 移动 Sass | dist CSS 含 rem;`.mobile-container` max-width 750px |
| 移动 Tailwind/UnoCSS | 无 postcss-pxtorem;有 mobile-container |
| 小程序 | 样式含 rpx;pages.json tabBar 路径存在;无 proxy 配置 |
| H5 通用 | env 注入;Vite/Nuxt proxy 与 .env 域名一致 |
| UI 库 | 首页或 Header 有库组件且 build 通过 |

失败 → 自行修到 build + typecheck 通过。

---

## 完成报告（只输出一次）

```
✅ 项目 {名称} 已初始化

📦 技术栈 + 端 + 设计稿约定
🌐 域名列表(dev/prod)
📁 关键文件清单
🚀 启动命令
⚠️ 待你替换:域名 / 业务壳 / logo导航 / 备案
📋 采用的默认值
🔗 后续组件 → /vue-component-gen
```

---

## 铁律

1. **8 问收齐 → 一口气跑完清单 13 项**,中间不确认、不分步汇报。
2. **冲突以「端」为准**,按决策表自动修正框架/UI/单位。
3. **会员=否 不加 Pinia/Zustand**,脚手架不加 --pinia。
4. **Tailwind/UnoCSS 移动禁止 pxtorem**;Sass 移动必须 flexible+pxtorem(75)+mobile-container。
5. **多域名四件套(H5)**:`.env*` + `env.ts` + `request` 多实例 + dev proxy;**小程序**无 proxy,直连 + 合法域名说明。
6. **UI 库装必注册**,首页能渲染一个库组件。
7. **拦截器/ApiResponse 是骨架**,业务壳注释标明待调。
8. **DefaultLayout + 路由按框架落地**,不能只有孤立 Header 组件。
9. **YAGNI** — 没要的 i18n/图表/CI 不加。
10. **交付前 dev + build + typecheck 必须通过**。
