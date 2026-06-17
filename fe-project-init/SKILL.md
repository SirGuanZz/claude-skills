---
name: fe-project-init
description: >-
  从 0 创建 H5 前端项目骨架(PC/移动),按问答确定技术栈,
  自动生成多域名拦截器、设计稿适配、Layout/公共组件,可选会员状态管理。
  Use when the user says "新建项目", "创建项目", "起一个项目", "从零搭项目",
  "初始化项目", "搭个前端架子", or /fe-project-init.
  答完 8 个问题后自动一口气执行到底,不再二次确认。
---

# fe-project-init: H5 前端项目从零初始化

从 0 起一个能立即跑起来的 **PC / 移动 H5** 项目骨架，覆盖端适配 → 多域名拦截器 → Layout/公共组件 → 路由 → 验证。

**核心纪律**：**只问 8 个问题，答完立刻一口气跑到底**——脚手架、装依赖、写代码、`dev` + `build` + 类型检查，全程不暂停、不二次确认。只有 npm 权限/网络实在跑不通时才停。

---

## 框架 × 端 决策表（问答结束后按此执行,冲突时以问题 2「端」为准）

| 端 | 允许框架 | 自动修正 | UI 库默认 | 样式默认 | 单位 |
|----|---------|---------|----------|---------|------|
| PC | Vue3+Vite / Nuxt3 / React+Vite / Next | — | Vue→Element Plus; React→无 | Sass | px, 主体 1200 |
| 移动 H5 | Vue3+Vite / Nuxt3 | 端=移动 时框架应为 Vue 系;若选了 Next 改为 Vue3+Vite | Vant | Sass | Sass→px 转 rem; Tailwind→rem 配置 |

**Pinia / Zustand**：仅问题 7 选「是」时装;脚手架 `--pinia` 同理。  
**Tailwind / UnoCSS + 移动 H5**：**禁止** postcss-pxtorem;改 Tailwind `theme.extend` 按 750 设计稿配 spacing/fontSize,或用 `rem` 直接写。

---

## 启动：问答收集需求（只此一轮,答完即开工）

用 `AskUserQuestion` **一次**收齐 8 项,答完**同一轮**开始执行,禁止再确认。信息不全 → 用「默认值」表 + 决策表,写进最终报告。

| # | 问题 | 选项/说明 |
|---|------|----------|
| 1 | 框架与渲染模式 | Vue3+Vite / Nuxt3 / React+Vite / Next;与问题 2 冲突以问题 2 为准 |
| 2 | 端类型 | PC(1920,主体1200,px) / 移动 H5(750,px→rem) |
| 3 | 语言 | TypeScript(默认) / JavaScript |
| 4 | 样式 | Sass / SCSS(默认) / CSS / Tailwind / UnoCSS |
| 5 | UI 组件库 | 按决策表默认;用户指定则覆盖 |
| 6 | 接口域名 | 名称+dev/prod 地址,至少 1 个(通常 2~4 个);未提供 → `main`+`user` 占位 |
| 7 | 会员管理 | 是→Pinia/Zustand+登录页+路由守卫;否→不加状态库 |
| 8 | 项目名+目录 | 默认 `./<项目名>` |

**默认值**：端=PC,语言=TS,样式=Sass,UI=见决策表,域名=main+user 占位,包管理器=npm(失败可试 pnpm)。

---

## 执行清单（全部 ✓ 后再出报告）

```
□ 1. 脚手架非交互跑通 + npm install
□ 2. .gitignore 含 .env.local / dist
□ 3. config/design.ts 与端一致
□ 4. 端适配: PC→layout 1200 | 移动 Sass→flexible+pxtorem+.mobile-container | 移动 Tailwind/UnoCSS→无 pxtorem
□ 5. .env.example + .env.development/.production(占位);密钥仅 .env.local
□ 6. config/env.ts + types/api.d.ts + utils/message.ts
□ 7. api/request.ts 多实例 + dev proxy
□ 8. UI 库已安装且已在 main.ts / nuxt.config 注册
□ 9. layouts + Header/Footer 或 TabBar
□ 10. 路由(router / pages)
□ 11. 会员模块(若选是)
□ 12. 项目 README.md(短)
□ 13. npm run dev + build + 类型检查通过
```

---

## 步骤 1：脚手架 + 基础工程

### 脚手架命令

| 框架 | 命令 | 备注 |
|------|------|------|
| Vue3+Vite | `npm create vue@latest <name> -- --ts --router [--pinia]` | `--pinia` 仅会员=是 |
| Nuxt3 | `npx nuxi@latest init <name>` | 会员=是时加 pinia module |
| React+Vite | `npm create vite@latest <name> -- --template react-ts` | |
| Next.js | `npx create-next-app@latest <name> --yes --ts --eslint --app --src-dir --import-alias "@/*"` | tailwind 与问题4冲突时去掉 --tailwind |

非交互 flag 用尽;失败 → 换镜像 / `--legacy-peer-deps` / 删 lock 重装,仍失败才停。

### `.gitignore`（立刻补）

```
node_modules / dist / .DS_Store / *.local / .env.local / .env.*.local
```

`.env.example` — 提交 git,只列 key 与占位 URL。  
`.env.development` / `.env.production` — 可提交,只用占位域名。  
`.env.local` — 不提交,放真实域名/密钥(Vite/Nuxt/Next 自动 merge)。  
加载顺序(Vite):`.env` → `.env.[mode]` → `.env.local` → `.env.[mode].local`。

### 依赖（按需装）

| 用途 | 包 |
|------|-----|
| 请求 | axios |
| 移动 rem(Sass) | postcss postcss-pxtorem |
| UI | element-plus / vant / @nuxt/ui 等 |
| 会员持久化 | pinia-plugin-persistedstate / zustand persist |
| Next dev:prod | env-cmd |
| 类型检查 | vue-tsc(Vue) / tsc(React) |

### UI 库注册（装完必须能用）

| 框架 | 注册方式 |
|------|---------|
| Vue3+Vite | Element Plus:`main.ts` `app.use`+css; Vant:同上或 `unplugin-vue-components`+`VantResolver` |
| Nuxt3 | `@element-plus/nuxt` / `@vant/nuxt` 或 client plugin |
| React | Ant Design:`ConfigProvider` 包根 + `antd/dist/reset.css` |

**验证**:首页或 Header 放一个库组件(如 `<el-button>`),build 通过且非裸 HTML。

---

## 步骤 2：端适配与设计稿

### `src/config/design.ts`

```ts
export type Platform = 'pc' | 'mobile'
export const DESIGN = {
  platform: 'pc' as Platform,
  designWidth: 1920,      // PC:1920 | 移动:750
  contentWidth: 1200,     // 仅 PC
  unit: 'px' as 'px' | 'px→rem' | 'tailwind-rem',
} as const
```

### PC — `src/styles/layout.scss`

```scss
$content-width: 1200px;
.page-wrapper { width: 100%; min-height: 100vh; }
.page-container { width: 100%; max-width: $content-width; margin: 0 auto; padding: 0 16px; box-sizing: border-box; }
```

不装 postcss-pxtorem。

### 移动 H5 + Sass（750→rem）

- `postcss.config.js`:`rootValue:75`; `selectorBlackList:['.norem',/^\.van-/]`
- `src/utils/flexible.ts`:根字号 `75*(clientWidth/750)`;宽屏 **max-width 750px 居中**
- `main.ts` 顶部 `import '@/utils/flexible'`
- `index.html` 加 viewport meta
- layout 追加 `.mobile-wrapper` / `.mobile-container { max-width:750px }`

### 移动 H5 + Tailwind / UnoCSS

不装 pxtorem;按 750 稿配 spacing/fontSize;加 `.mobile-container`;`DESIGN.unit='tailwind-rem'`。

---

## 步骤 3：环境变量、类型、拦截器、Proxy

### 目录

```
src/config/{env,design}.ts  types/api.d.ts  utils/message.ts  api/{request,modules/example}.ts
.env.{development,production,example}
```

### 环境变量

key → `VITE_API_<KEY>` / `NUXT_PUBLIC_API_<KEY>` / `NEXT_PUBLIC_API_<KEY>`

| 文件 | 时机 | 内容 |
|------|------|------|
| `.env.development` | dev / build:dev | 占位 dev 域名 |
| `.env.production` | dev:prod / build | 占位 prod 域名 |
| `.env.local` | 所有 mode,最高优先级 | 真实域名/密钥(不提交) |

### npm scripts

**Vite(Vue/React)**:`dev` / `dev:prod` / `build` / `build:dev` / `typecheck`(vue-tsc 或 tsc -b)

**Nuxt3**:`nuxt dev|build --dotenv .env.{development|production}` / `nuxt typecheck`

**Next.js**:`next dev` / `dev:prod`(env-cmd) / `build` / `typecheck`;需装 env-cmd

### 核心文件

**`types/api.d.ts`** — `ApiResponse<T>{code,data,msg}` + `PageResult<T>`

**`config/env.ts`** — `APP_ENV` / `getApiBase(key)` 读 `.env`

**`utils/message.ts`** — 按 UI 库封装 `showError` / `showSuccess`

**`api/request.ts`** — `createRequest(baseKey)` 多实例;token/Content-Type/timeout/AbortController;解 `ApiResponse`;`code!==0`→showError;401→清登录+跳登录;`cancelAllRequests()`

### Dev Proxy

**Vite** — `vite.config.ts` 每条 API key:`/api-{key}`→`VITE_API_{KEY}`,rewrite 去前缀

**Nuxt** — `nitro.devProxy` 读 `NUXT_PUBLIC_API_*`

**Next** — `rewrites` 或 env-cmd 直连(可选)

**baseURL**:`import.meta.env.DEV ? '/api-main' : getApiBase('main')`

---

## 步骤 4：Layout 与公共组件

```
src/layouts/DefaultLayout.{vue,tsx}  components/layout/{AppHeader,AppFooter}  components/common/AppPopup.vue
```

| 端 | Layout | Header | Footer |
|----|--------|--------|--------|
| PC | `.page-wrapper`>Header+`.page-container`+Footer | 1200 居中,logo+导航+用户区 | 1200 三段式 |
| 移动 H5 | `.mobile-wrapper`>Header+`.mobile-container`+TabBar | 顶栏 | TabBar,无 Footer |

Popup:`v-model`/`title`/slots。会员=是:Header 右侧登录/头像下拉。

---

## 步骤 5：会员管理（仅问题 7=是）

`src/stores/user.ts` — state:`token`/`userInfo`/`isLogin`;actions:`login`/`logout`/`fetchUserInfo`;持久化 localStorage / useCookie(Nuxt)。登录页+拦截器带 token,登录走 `userRequest`。

---

## 步骤 6：路由与基础页面

| 框架 | 要点 |
|------|------|
| Vue3+Vite | `router`: `/`/`/login`(会员)/`/404`;`beforeEach` 鉴权+`cancelAllRequests()` |
| Nuxt3 | `pages/`+`error.vue`;会员→`middleware/auth.ts`;css 引入 layout.scss |
| React+Vite | `react-router-dom` 嵌套 DefaultLayout |
| Next App Router | `app/layout.tsx` 包 DefaultLayout;客户端组件 `'use client'` |

首页 dev 模式可展示 `API_BASE`+`DESIGN`,须 `if (import.meta.env.DEV)` 包裹。

---

## 步骤 7：项目 README.md

生成 **20~40 行** README:启动命令、设计稿约定、域名(.env.example→.env.local)、新增域名四件套同步、后续用 vue-component-gen。

---

## 步骤 8：验证

```bash
cd <project> && npm install && npm run dev && npm run build && npm run typecheck
```

| 端 | 检查 |
|----|------|
| PC | max-width:1200px |
| 移动 Sass | dist 含 rem;`.mobile-container` max-width 750px |
| 移动 Tailwind/UnoCSS | 无 pxtorem;有 mobile-container |
| H5 通用 | env 注入;proxy 与 .env 一致;UI 库组件 build 通过 |

失败 → 自行修到 build + typecheck 通过。

---

## 完成报告（只输出一次）

```
✅ 项目 {名称} 已初始化
📦 技术栈 + 端 + 设计稿约定
🌐 域名列表(dev/prod)
📁 关键文件清单
🚀 启动命令
⚠️ 待替换:域名 / 业务壳 / logo导航 / 备案
📋 采用的默认值
🔗 后续组件 → /vue-component-gen
```

---

## 铁律

1. **8 问收齐 → 一口气跑完清单 13 项**,中间不确认。
2. **冲突以「端」为准**;会员=否不加 Pinia/Zustand / `--pinia`。
3. **移动**:Sass 必须 flexible+pxtorem(75)+mobile-container;Tailwind/UnoCSS 禁止 pxtorem。
4. **多域名**:`.env*`+`env.ts`+request 多实例+dev proxy。
5. **UI 装必注册**;**DefaultLayout+路由按框架落地**;**ApiResponse 骨架**注释待调。
6. **YAGNI**;**交付前 dev+build+typecheck 必须通过**。
