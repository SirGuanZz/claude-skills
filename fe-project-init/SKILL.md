---
name: fe-project-init
description: >-
  从 0 创建 H5 前端项目骨架(PC/移动),按问答确定技术栈、是否接口调用、PC 是否移动自适应,
  自动生成多域名拦截器、设计稿适配、Layout/公共组件、骨架中文注释与 README 目录导读,可选会员状态管理。
  Use when the user says "新建项目", "创建项目", "起一个项目", "从零搭项目",
  "初始化项目", "搭个前端架子", or /fe-project-init.
  答完 10 个问题后自动一口气执行到底,不再二次确认。
---

# fe-project-init: H5 前端项目从零初始化

从 0 起一个能立即跑起来的 **PC / 移动 H5** 项目骨架，覆盖端适配 → (可选)多域名拦截器 → Layout/公共组件 → 路由 → 验证。

**核心纪律**：**只问 10 个问题，答完立刻一口气跑到底**——脚手架、装依赖、写代码、`dev` + `build` + 类型检查，全程不暂停、不二次确认。只有 npm 权限/网络实在跑不通时才停。

---

## 框架 × 端 决策表（问答结束后按此执行,冲突时以问题 2「端」为准）

| 端 | 允许框架 | 自动修正 | UI 库默认 | 样式默认 | 单位 |
|----|---------|---------|----------|---------|------|
| PC | Vue3+Vite / Nuxt3 / React+Vite / Next | — | Vue→Element Plus; React→无 | **Tailwind** | px, 主体 1200 |
| 移动 H5 | Vue3+Vite / Nuxt3 | 端=移动 时框架应为 Vue 系;若选了 Next 改为 Vue3+Vite | Vant | **Tailwind** | Tailwind→rem 配置(750 稿);用户选 Sass→px 转 rem |

**项目类型(问题 3)**：纯静态 → **不生成** axios / `.env*` 域名 / `api/request` / dev proxy / 会员;有接口 → 生成完整请求层。  
**PC 移动自适应(问题 4,仅 PC)**：是 → viewport + 媒体查询响应式;否 → 固定 1200 居中。移动 H5 不适用此问。  
**Pinia / Zustand**：问题 3=有接口 **且** 问题 9=是 时装;脚手架 `--pinia` 同理。  
**Tailwind / UnoCSS + 移动 H5**：**禁止** postcss-pxtorem;改 `theme.extend` 按 750 稿配 spacing/fontSize,或用 `rem` 直接写。

**设计纪律(默认按用户级 `~/.claude/CLAUDE.md` 落地,所有端/框架通用)**：
- **字体**:Google Fonts 双字族(Inter/Manrope 做正文 + Space Grotesk/DM Serif Display 做标题),`<head>` 加 `preconnect`,Tailwind `theme.extend.fontFamily` 注册 `font-sans` / `font-display`。
- **配色**:在 `tailwind.config` 写 `theme.extend.colors.brand`(占位非紫色,如 `#0EA5E9` / `#F97316` / `#10B981` 三选一),色阶**必须 50/100/200/300/400/500/600/700/800/900 十档全配**(否则渐变/hover fallback 到默认 sky/cyan 会掉对比度);禁默认紫蓝渐变。
- **背景**:`App.vue` / `app.vue` / 根 layout 用渐变 + SVG 噪点纹理,禁纯白纯灰大面积铺底。
- **动效**:交互组件至少一个 `transition` + `hover` / `:active` 反馈,150~400ms,`ease-out`。
- **响应式**:375 / 768 / 1280 三档必须成立。
- **对比度铁律(必查)**:正文与背景对比度 ≥ 4.5:1,大字号(≥18px 或 14px 加粗)≥ 3:1。落地三条:① 浅底(slate-50/white/渐变浅色)上正文用 `text-slate-700` 起步、副文用 `text-slate-600`、标题 `text-slate-900`,**禁** `text-slate-300/400/500` 当正文;② 渐变文字(`bg-clip-text`)起止两端都必须落在 `brand-600` 及以上深色档(`from-brand-700 via-brand-600 to-brand-500` 是安全模板,**禁** `to-brand-300/400`);③ hover 态颜色变化幅度 ≥ 一档色阶,且变化后仍满足 4.5:1。

**Vue Router 5.x 雷区(create-vue 自 2026 起默认拉 v5,非经典 v4)**:
- 路由**全部同步 import**,首屏页面禁止 `() => import()`(scaffold 默认会给 AboutView 加,**必须改回**)。
- DefaultLayout 用**裸 `<RouterView />`**,**不默认**配 `<transition mode="out-in">` 或 `<Suspense>`(组合会触发路由切换白屏,刷新才正常)。
- 真要切换动画,让用户在确认 router 版本兼容后自行加,并务必 Suspense 包异步组件。

---

## 启动：问答收集需求（只此一轮,答完即开工）

用 `AskUserQuestion` **一次**收齐 10 项,答完**同一轮**开始执行,禁止再确认。信息不全 → 用「默认值」表 + 决策表,写进最终报告。

| # | 问题 | 选项/说明 | 条件 |
|---|------|----------|------|
| 1 | 框架与渲染模式 | Vue3+Vite / Nuxt3 / React+Vite / Next;与问题 2 冲突以问题 2 为准 | 必问 |
| 2 | 端类型 | PC(1920,主体1200,px) / 移动 H5(750,px→rem) | 必问 |
| 3 | 项目类型 | 纯静态(无接口) / 有接口调用 | **PC 与移动都问** |
| 4 | 移动端自适应 | 是 / 否 | **仅 PC 时问**;移动 H5 跳过(本身即移动) |
| 5 | 语言 | TypeScript(默认) / JavaScript | 必问 |
| 6 | 样式 | **Tailwind(默认)** / Sass / SCSS / UnoCSS / CSS | 必问 |
| 7 | UI 组件库 | 按决策表默认;用户指定则覆盖 | 必问 |
| 8 | 接口域名 | 名称+dev/prod 地址,通常 2~4 个;未提供 → `main`+`user` 占位 | **仅问题 3=有接口** |
| 9 | 会员管理 | 是→Pinia/Zustand+登录页+路由守卫;否→不加状态库 | **仅问题 3=有接口** |
| 10 | 项目名+目录 | 默认 `./<项目名>` | 必问 |

**默认值**：端=PC,项目类型=有接口,PC自适应=否,语言=TS,样式=**Tailwind**,UI=见决策表,域名=main+user 占位,包管理器=npm(失败可试 pnpm)。

---

## 步骤 0：代码注释规范（开工前必读）

骨架代码须让**后续接手的人不读 SKILL 也能懂**。先看完本节再写任何文件。

### 风格铁律（4 条,继承自用户级 `~/.claude/CLAUDE.md`）

1. **WHY 不 WHAT** — 解释为什么这样写(约束、副作用、修改注意),不解释字面在做什么(变量/函数名能看懂的别注)。
2. **中文为主,术语保留英文** — baseURL / interceptor / middleware / token / composable 等不翻译。
3. **文件头三段式** — `职责` + `依赖方(谁读它)` + `修改注意点(改这里同步改哪里)`,缺一不可。
4. **禁废话注释** — "定义变量"/"调用函数"/"导入路由"/"创建 store" 一律不写。

### 必加注释文件清单（按生成顺序）

| 文件 | 必加内容 | 条件 |
|------|---------|------|
| `src/config/design.ts` | 文件头三段式 + 每个字段一行含义 | 必 |
| `src/config/env.ts` | 文件头三段式 + `getApiBase` 何时读 dev/prod | 有接口 |
| `src/types/api.d.ts` | `ApiResponse` 注「按后端实际结构调整」+ 字段含义 | 有接口 |
| `src/api/request.ts` | 文件头三段式 + 多实例用法 + 请求/响应拦截分段 + 401 跳转路由名 | 有接口 |
| `src/api/modules/*.ts` | 每个导出函数 JSDoc(`@param`/`@returns` + 业务说明) | 有接口 |
| `src/stores/user.ts` | 文件头(持久化方式 + token 字段 + 与拦截器的关系) | 会员=是 |
| `src/router/index.ts` 或 `middleware/auth.ts` | 路由表分段 + `beforeEach`/middleware 鉴权分段 | Vue/Nuxt |
| `src/layouts/DefaultLayout.{vue,tsx}` | 文件头(PC/移动差异 + 为何 RouterView 裸写) | 必 |
| `src/components/layout/AppHeader.{vue,tsx}` | 文件头 + 用户区/导航条件渲染分段 | 必 |
| `src/components/common/AppPopup.{vue,tsx}` | 文件头 + props 含义 + slots 用途 | 必 |
| 首页 `views/HomeView.vue` 或 `pages/index.vue` | 文件头标注「审美样板,正式开发可整体替换」 | 必 |
| `views/LoginView.vue` | 文件头 + 表单/校验/登录流程分段 | 会员=是 |
| `.env.example` | 每个 key 行尾 `#` 注释用途 + 示例值 | 有接口 |
| `tailwind.config.{ts,js}` | `theme.extend.colors.brand` 注「占位色,按品牌替换」 | Tailwind |
| `README.md` | 「目录导读」表 + 「设计纪律 cheatsheet」 | 必 |

### 风格示例（直接照抄）

**1. 文件头三段式(所有 config / api / store / layout 必做)**

```ts
/**
 * 设计稿与端适配约定 — 全项目 UI 单位/布局的单一真相源
 * 依赖方:layouts/* 媒体查询、tailwind.config spacing、vue-component-gen 读 platform 字段
 * 修改注意:改 designWidth/platform 时同步检查 layout 与 tailwind 配置;勿改导出字段名
 */
```

**2. 接口函数 JSDoc(`api/modules/*`)**

```ts
/**
 * 获取当前登录用户信息
 * @returns 用户基础资料 + 角色码;401 由 request 拦截器统一跳登录,无需调用方处理
 */
export const getUserInfo = () => userRequest.get<UserInfo>('/user/info')
```

**3. 拦截器分段(`api/request.ts`)**

```ts
// --- 请求拦截:附加 token + Content-Type;FormData 时不覆盖浏览器自动 boundary ---
// --- 响应拦截:解 ApiResponse 业务壳;code !== 0 → showError;401 → 清登录态并跳 /login ---
```

**4. 路由表分段(`router/index.ts`)**

```ts
const routes = [
  // --- 公开路由 ---
  { path: '/', name: 'home', component: HomeView },
  // --- 鉴权路由(beforeEach 校验 token) ---
  { path: '/profile', name: 'profile', component: ProfileView, meta: { auth: true } },
]
```

**5. `.env.example` 行尾注释**

```bash
VITE_API_MAIN=https://dev-api.example.com   # 主业务域名,联调时改 .env.local 覆盖
VITE_API_USER=https://dev-user.example.com  # 用户中心域名
```

**6. 禁止的废话注释(反例 vs 正例)**

```ts
// ❌ 反例:在说"做了什么",删
// 导入 axios
import axios from 'axios'
// 创建 user store
export const useUserStore = defineStore(...)

// ✅ 正例:解释"为什么"
// 不同业务域走独立实例:baseURL 隔离 + 401 跳转互不干扰
const userRequest = createRequest('user')
```

---

## 执行清单（全部 ✓ 后再出报告）

```
□ 1. 脚手架非交互跑通 + npm install
□ 2. .gitignore 含 .env.local / dist
□ 3. config/design.ts 与端/自适应一致
□ 4. 端适配: PC固定1200 | PC+自适应→媒体查询 | 移动 Sass→flexible+pxtorem | 移动 Tailwind→无 pxtorem
□ 5. 设计纪律: Google Fonts 双字族(Inter+Space Grotesk 默认) + tailwind.config 注册 font-sans/font-display + theme.extend.colors.brand **十档全配**(50~900)非紫调色板 + 浅底正文 ≥ slate-700 / 标题 slate-900 / 渐变文字止于 brand-500 不再浅(对比度 ≥ 4.5:1)
□ 6. 有接口: .env.example + .env.development/.production + config/env.ts + api/request + dev proxy
□ 7. 有接口: types/api.d.ts + utils/message.ts;纯静态:仅 utils/message(可选,按 UI 库)
□ 8. UI 库已安装且已在 main.ts / nuxt.config 注册
□ 9. layouts: 根容器渐变+噪点背景 + Header/Footer 或 TabBar(字号/字重层次到位)
□ 10. 路由(router / pages) + 首页样板(渐变 hero + 大字标题 + hover 微动效,非裸 demo);Vue 路由全同步 import + 裸 `<RouterView />`
□ 11. 会员模块(问题 3=有接口 且 问题 9=是)
□ 12. 按「步骤 0」清单逐项加注释(文件头三段式 / 分段标注 / 函数 JSDoc / `.env.example` 行尾 `#`),清单缺一即未通过
□ 13. 项目 README.md(含设计纪律 + 目录导读 cheatsheet)
□ 14. npm run dev + build + 类型检查通过
```

---

## 步骤 1：脚手架 + 基础工程

### 脚手架命令

| 框架 | 命令 | 备注 |
|------|------|------|
| Vue3+Vite | `npm create vue@latest <name> -- --ts --router [--pinia]` | `--pinia` 仅问题 3=有接口且问题 9=是 |
| Nuxt3 | `npx nuxi@latest init <name>` | 同上时加 pinia module |
| React+Vite | `npm create vite@latest <name> -- --template react-ts` | |
| Next.js | `npx create-next-app@latest <name> --yes --ts --eslint --app --src-dir --import-alias "@/*"` | tailwind 与问题6冲突时去掉 --tailwind |

非交互 flag 用尽;失败 → 换镜像 / `--legacy-peer-deps` / 删 lock 重装,仍失败才停。

### `.gitignore`（立刻补）

```
node_modules / dist / .DS_Store / *.local / .env.local / .env.*.local
```

纯静态项目可不建 `.env*`,但 `.gitignore` 仍保留以备后续扩展。

### 依赖（按需装,纯静态不装请求相关）

| 用途 | 包 | 条件 |
|------|-----|------|
| 请求 | axios | 有接口 |
| 样式(默认) | tailwindcss + postcss + autoprefixer | 样式=Tailwind |
| 移动 rem(Sass) | postcss postcss-pxtorem | 移动 H5 + Sass |
| UI | element-plus / vant / @nuxt/ui 等 | 按问题 7 |
| 会员持久化 | pinia-plugin-persistedstate / zustand persist | 有接口+会员=是 |
| Next dev:prod | env-cmd | Next + 有接口 |
| 类型检查 | vue-tsc(Vue) / tsc(React) | 必装 |

### UI 库注册（装完必须能用）

| 框架 | 注册方式 |
|------|---------|
| Vue3+Vite | Element Plus:`main.ts` `app.use`+css; Vant:同上或 `unplugin-vue-components`+`VantResolver` |
| Nuxt3 | `@element-plus/nuxt` / `@vant/nuxt` 或 client plugin |
| React | Ant Design:`ConfigProvider` 包根 + `antd/dist/reset.css` |

**验证**:首页或 Header 放一个库组件(如 `<el-button>`),build 通过且非裸 HTML。

### 设计 token + Google Fonts（默认必做,样式=Tailwind 时强制）

落地用户级 `~/.claude/CLAUDE.md` 的设计纪律。

**1. Google Fonts 注入**

`index.html`(Vue/React/Vite)或 `app.head`(Nuxt 配在 `nuxt.config.ts` 的 `app.head.link`):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
```

可按项目气质替换:正文(Inter / Manrope / DM Sans)+ 标题(Space Grotesk / DM Serif Display / Playfair Display)。**禁止只用系统默认字体**。

**2. Tailwind 配置(样式=Tailwind 时)**

`tailwind.config.ts` `theme.extend`:

```ts
export default {
  content: ['./index.html', './src/**/*.{vue,ts,tsx,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
      },
      colors: {
        // 占位主色:三选一,禁紫色。生成时随机或按项目气质挑
        // 必须配齐 50~900 十档,否则 from-brand-X / hover:bg-brand-X 渐变会 fallback 到默认色,掉对比度
        brand: {
          50:  '#F0F9FF', 100: '#E0F2FE', 200: '#BAE6FD', 300: '#7DD3FC',
          400: '#38BDF8', 500: '#0EA5E9', 600: '#0284C7', 700: '#0369A1',
          800: '#075985', 900: '#0C4A6E',
        },
        // 备选色阶(全 10 档,挑一组替换上面的 brand):
        // 橙: 50:#FFF7ED 100:#FFEDD5 200:#FED7AA 300:#FDBA74 400:#FB923C 500:#F97316 600:#EA580C 700:#C2410C 800:#9A3412 900:#7C2D12
        // 绿: 50:#ECFDF5 100:#D1FAE5 200:#A7F3D0 300:#6EE7B7 400:#34D399 500:#10B981 600:#059669 700:#047857 800:#065F46 900:#064E3B
        // 玫红 / 琥珀同理,在 tailwindcss.com/docs/customizing-colors 里挑十档
      },
      backgroundImage: {
        // 渐变光斑保持低饱和,真正的视觉重量靠文字与卡片;alpha 0.18~0.22 是 slate-50 底上"看得见但不抢戏"的甜区
        'hero-gradient': 'radial-gradient(at 20% 0%, rgba(14,165,233,0.18), transparent 50%), radial-gradient(at 80% 100%, rgba(16,185,129,0.15), transparent 50%)',
      },
    },
  },
}
```

`src/styles/main.css`(或 `app.css`)顶部引入:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 浅底正文起步色 slate-700,副文 slate-600,标题 slate-900 — 满足 4.5:1 对比度 */
html, body { @apply font-sans text-slate-700 antialiased bg-slate-50; }
h1, h2, h3, h4 { @apply font-display tracking-tight text-slate-900; }
p { @apply text-slate-700; }
.text-muted { @apply text-slate-600; }      /* 副文/说明文字,仍 ≥ 4.5:1 */
a { @apply text-brand-700 hover:text-brand-800 transition-colors; }
```

**禁止用 `text-slate-300/400/500` 作正文色**(在 slate-50 底上对比度不足 4.5:1);仅可用于装饰性图标/分隔线。

报告中提示用户:配色为占位色,可在 `tailwind.config` 替换主题色。

**3. Sass / CSS 项目(用户选了 Sass)**

仍注入 Google Fonts。`src/styles/main.scss`:

```scss
// 主色十档 — 必须全配,渐变与 hover 才不会 fallback 到默认色掉对比度
$brand-50:  #F0F9FF; $brand-100: #E0F2FE; $brand-200: #BAE6FD; $brand-300: #7DD3FC;
$brand-400: #38BDF8; $brand-500: #0EA5E9; $brand-600: #0284C7; $brand-700: #0369A1;
$brand-800: #075985; $brand-900: #0C4A6E;

// 文字色阶 — 浅底上 ≥ 4.5:1
$text-heading: #0F172A;  // slate-900
$text-body:    #334155;  // slate-700
$text-muted:   #475569;  // slate-600,副文/说明,仍达标

:root {
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-display: 'Space Grotesk', 'Inter', sans-serif;
}
html, body {
  font-family: var(--font-sans);
  color: $text-body;
  background: #F8FAFC;
  -webkit-font-smoothing: antialiased;
}
h1, h2, h3, h4 { font-family: var(--font-display); color: $text-heading; letter-spacing: -0.01em; }
p { color: $text-body; }
.text-muted { color: $text-muted; }
a { color: $brand-700; transition: color .2s ease-out; &:hover { color: $brand-800; } }
```

---

## 步骤 2：端适配与设计稿

### `src/config/design.ts`

```ts
/**
 * 设计稿与端适配约定 — 全项目 UI 单位/布局的单一真相源
 * - 改设计稿宽度或端类型时同步检查 layout 样式与 tailwind 配置
 * - vue-component-gen 会读取本文件,勿随意改名导出字段
 */
export type Platform = 'pc' | 'mobile'
export const DESIGN = {
  platform: 'pc' as Platform,
  designWidth: 1920,      // PC:1920 | 移动:750
  contentWidth: 1200,     // 仅 PC 内容区最大宽度(px)
  responsive: false,      // PC+问题4=是 → true,启用 layout 媒体查询
  unit: 'px' as 'px' | 'px→rem' | 'tailwind-rem',
  hasApi: true,           // 问题3=有接口;纯静态项目改为 false
} as const
```

### PC 固定宽度（问题 4=否）

`src/styles/layout.scss`:

```scss
$content-width: 1200px;
.page-wrapper { width: 100%; min-height: 100vh; }
.page-container { width: 100%; max-width: $content-width; margin: 0 auto; padding: 0 16px; box-sizing: border-box; }
```

不装 postcss-pxtorem。`DESIGN.responsive = false`。

### PC + 移动端自适应（问题 4=是）

在 PC 固定布局基础上追加响应式,**不**切 rem(保持 PC 设计 px 体系):

- `index.html` 加 viewport meta
- `layout.scss` 追加断点,建议 `768px` / `1200px`:

```scss
// 小屏:容器满宽、间距收紧
@media (max-width: 768px) {
  .page-container { max-width: 100%; padding: 0 12px; }
  .app-header { flex-wrap: wrap; }  // 导航可折行或后续改汉堡菜单
}
// 中屏:可选介于满宽与 1200 之间
@media (max-width: 1200px) {
  .page-container { padding: 0 20px; }
}
```

- Header/Footer 组件内部用 `%` / `flex` / `min-width:0`,避免小屏横向溢出
- `DESIGN.responsive = true`;报告注明断点与待完善汉堡菜单位

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

### 有接口（问题 3=有接口）

目录:

```
src/config/{env,design}.ts  types/api.d.ts  utils/message.ts  api/{request,modules/example}.ts
.env.{development,production,example}
```

key → `VITE_API_<KEY>` / `NUXT_PUBLIC_API_<KEY>` / `NEXT_PUBLIC_API_<KEY>`

| 文件 | 时机 | 内容 |
|------|------|------|
| `.env.development` | dev / build:dev | 占位 dev 域名 |
| `.env.production` | dev:prod / build | 占位 prod 域名 |
| `.env.local` | 最高优先级 | 真实域名/密钥(不提交) |

**`api/request.ts`** — `createRequest(baseKey)` 多实例;token/Content-Type/timeout/AbortController;解 `ApiResponse`;`code!==0`→showError;401→清登录+跳登录;`cancelAllRequests()`

**Dev Proxy** — Vite:`/api-{key}`→`VITE_API_{KEY}`;Nuxt:`nitro.devProxy`;Next:`rewrites` 或 env-cmd

**baseURL**:`import.meta.env.DEV ? '/api-main' : getApiBase('main')`

### 纯静态（问题 3=纯静态）

**不生成**:`api/request.ts`、`config/env.ts`(API 部分)、`.env.development`/`.env.production`、dev proxy、`types/api.d.ts`。

仅保留 `config/design.ts`、`utils/message.ts`(若用 UI 库提示)。首页**不展示** API 信息。README 注明「纯静态,后续加接口见新增域名四件套」。纯静态仍须 `design.ts` + Layout + README **目录导读**注释。

---

## 步骤 4：Layout 与公共组件

```
src/layouts/DefaultLayout.{vue,tsx}  components/layout/{AppHeader,AppFooter}  components/common/AppPopup.vue
```

| 端 | Layout | Header | Footer |
|----|--------|--------|--------|
| PC | `.page-wrapper`>Header+`.page-container`+Footer | 1200 居中,logo+导航+用户区;自适应时小屏可折行 | 1200 三段式 |
| 移动 H5 | `.mobile-wrapper`>Header+`.mobile-container`+TabBar | 顶栏 | TabBar,无 Footer |

**根容器视觉(默认必加,落地"避免纯白纯灰"纪律)**:`.page-wrapper` / `.mobile-wrapper` 必须有渐变 + 噪点纹理背景,禁纯 `#fff` / `#f5f5f5` 大面积铺底。`<RouterView />` **裸写**,不默认套 transition / Suspense(见决策表雷区)。Tailwind 项目示例:

```vue
<template>
  <div class="relative min-h-screen bg-slate-50 bg-hero-gradient">
    <div class="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><filter id=%22n%22><feTurbulence baseFrequency=%220.9%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>')]"></div>
    <AppHeader />
    <main class="page-container relative">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>
```

Sass 项目:`.page-wrapper { background: radial-gradient(at 20% 0%, rgba(14,165,233,.12), transparent 50%), radial-gradient(at 80% 100%, rgba(16,185,129,.10), transparent 50%), #F8FAFC; }`,噪点同上以伪元素 `::before` 叠加。

**Header 字体层次**:logo 用 `font-display` + `text-slate-900`,导航默认态 `text-slate-700` 中等字重(500~600),hover 升到 `text-brand-700` + 下划线动效(`transition-all duration-200`),活跃态 `text-brand-800 font-semibold` + 底部 2px brand-600 横线。**禁** `text-slate-400/500` 当导航默认态(对比度不够)。

Popup:`v-model`/`title`/slots,过渡用 `transition` 包 `opacity` + `translate-y`,150~250ms `ease-out`。有接口+会员=是:Header 右侧登录/头像下拉。

---

## 步骤 5：会员管理（问题 3=有接口 且 问题 9=是）

`src/stores/user.ts` — state:`token`/`userInfo`/`isLogin`;actions:`login`/`logout`/`fetchUserInfo`;持久化 localStorage / useCookie(Nuxt)。登录页+拦截器带 token,登录走 `userRequest`。

---

## 步骤 6：路由与基础页面

| 框架 | 要点 |
|------|------|
| Vue3+Vite | `router`: `/`/`/login`(会员)/`/404`;有接口+会员→`beforeEach` 鉴权+`cancelAllRequests()` |
| Nuxt3 | `pages/`+`error.vue`;有接口+会员→`middleware/auth.ts`;css 引入 layout.scss |
| React+Vite | `react-router-dom` 嵌套 DefaultLayout |
| Next App Router | `app/layout.tsx` 包 DefaultLayout;客户端组件 `'use client'` |

### Vue Router 模板（Vue3+Vite，**同步 import，覆盖 scaffold 默认**）

```ts
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/about', name: 'about', component: AboutView },
  ],
})
export default router
```

`create-vue` 默认把 `AboutView` 写成 `() => import(...)`,**必须改回同步**(v5 + transition 组合白屏)。仅深层非首屏大体积页面才考虑懒加载,且 layout 必须 `<Suspense>` 兜底。

DefaultLayout 里 `<RouterView />` 裸写即可,**默认不加** transition / Suspense。

### 首页 demo(默认必做,**禁止裸文字 demo**)

落地"有审美的样板首页",必须包含:

1. **Hero 区**:大字标题(`font-display` + `text-4xl md:text-6xl` + `tracking-tight`)。**渐变文字必须 `from-brand-800 via-brand-600 to-brand-500`**(三停止点全在深色档,浅底对比度 ≥ 4.5:1);**禁** `to-brand-300/400`(实测在 `bg-slate-50` 上对比度跌到 3:1 以下,主标题读不清)。副标题用 `text-slate-700` 正文字族,**禁** `text-slate-400/500`。CTA 按钮 `bg-brand-700 text-white hover:bg-brand-800` + `hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200`(白字在 brand-700 底上对比度达标)。
2. **Feature Grid**:3 张卡片,`bg-white/90 backdrop-blur` 底(渐变背景透出但保证文字底色),圆角 `rounded-2xl`,`shadow-sm` + `hover:shadow-xl` + `hover:-translate-y-1` + `transition`,卡片内图标(用 `text-brand-700`,**非** `text-brand-400`) + 标题(`text-slate-900 font-semibold`) + 描述(`text-slate-600`),字号至少两层。
3. **响应式**:`grid-cols-1 md:grid-cols-3`,375 / 768 / 1280 三档不溢出。
4. **有接口 + dev 模式** 才在页脚 `<details>` 折叠区里展示 `API_BASE` + `DESIGN`(`if (import.meta.env.DEV)` 包裹),不污染审美。纯静态首页不展示这些。

报告中提示:首页为审美样板,正式开发可整体替换。

---

## 步骤 7：项目 README.md

生成 **25~50 行** README:启动命令、设计稿约定、项目类型(纯静态/有接口)、PC 是否自适应、域名(有接口时 `.env.example`→`.env.local`)、后续用 vue-component-gen,以及 **设计纪律 cheatsheet** + **目录导读**:

```markdown
## 目录导读(给后续开发者)
| 路径 | 职责 |
|------|------|
| src/config/design.ts | 设计稿/端/单位约定,改 UI 先看 |
| src/config/env.ts | 域名与 getApiBase(有接口时) |
| src/api/request.ts | 统一请求与拦截器,页面勿裸 axios |
| src/layouts/ | 全局布局,PC/移动结构差异见文件头注释 |
| src/stores/user.ts | 登录态(有会员时) |

## 设计纪律(继承自 ~/.claude/CLAUDE.md)
- 字体:Inter(正文) + Space Grotesk(标题),已通过 Google Fonts 注入
- 主色:占位 brand 色阶(50~900 十档)在 tailwind.config(或 main.scss),按品牌替换;**禁紫色**
- 文字对比度:浅底正文 `text-slate-700`、副文 `text-slate-600`、标题 `text-slate-900`,渐变文字 `from-brand-800 via-brand-600 to-brand-500`,**对比度 ≥ 4.5:1**
- 背景:渐变 + 噪点,禁纯白纯灰大面积铺底
- 动效:交互组件 hover/active 微动效,150~400ms ease-out
- 响应式:375 / 768 / 1280 三断点必须成立
- 禁:紫色背景或主题色、默认系统字体、SaaS 模板风、零动效静态页、`text-slate-300/400/500` 当正文、`to-brand-300/400` 当主标题色
```

---

## 步骤 8：验证

```bash
cd <project> && npm install && npm run dev && npm run build && npm run typecheck
```

| 端 | 检查 |
|----|------|
| PC 固定 | max-width:1200px |
| PC 自适应 | 含媒体查询;375px 视口下容器不满宽溢出 |
| 移动 Sass | dist 含 rem;`.mobile-container` max-width 750px |
| 移动 Tailwind/UnoCSS | 无 pxtorem;有 mobile-container |
| 有接口 | env 注入;proxy 与 .env 一致 |
| 纯静态 | 无 request.ts / 无 .env 域名文件 |
| 通用 | UI 库组件 build 通过 |
| Vue 路由 | router 全同步 import;DefaultLayout 内 `<RouterView />` 裸写,无 transition/Suspense |
| 路由切换 | dev 起服后**告知用户手测**:点 Header 各 nav 来回切,无空白(SPA 行为 build 验不出) |
| 设计纪律 | Google Fonts 已 preconnect 且加载;`font-display` 在 h1/h2 生效;`brand` 色阶**十档全配且非紫色**;根容器有渐变+噪点;首页含 hover 微动效与字号≥2 层;**正文用 slate-700/标题 slate-900/渐变文字止于 brand-500**(浏览器 devtools 取色对比度 ≥ 4.5:1,无 `text-slate-300/400`、无 `to-brand-300/400` 当主标题色) |
| 代码注释 | 按「步骤 0」清单逐项核对:文件头三段式 / 拦截器与路由分段 / 接口函数 JSDoc / `.env.example` 行尾 `#` / README 目录导读,缺一即未通过 |

失败 → 自行修到 build + typecheck 通过。

---

## 完成报告（只输出一次）

```
✅ 项目 {名称} 已初始化
📦 技术栈 + 端 + 项目类型(纯静态/有接口) + PC自适应(是/否/不适用)
🧭 vue-router: <从 package.json 读出>(v5.x 时附"路由已全同步 import + 裸 RouterView,规避白屏")
🌐 域名列表(dev/prod) — 纯静态则标注「无」
📁 关键文件清单
📝 已加多人协作注释 + README 目录导读
🎨 设计纪律: 字族(Inter+Space Grotesk) / brand 占位色 / 渐变背景 / 已落地
🚀 启动命令
🖱️ 路由切换请手测(SPA 客户端行为,build 验不到)
⚠️ 待替换:域名 / 业务壳 / logo导航 / 备案 / brand 主题色(占位非紫,按品牌换)
📋 采用的默认值
🔗 后续组件 → /vue-component-gen
```

---

## 铁律

1. **10 问收齐 → 一口气跑完清单**,中间不确认;问题 4/8/9 按条件跳过时用默认值并记入报告。
2. **冲突以「端」为准**;有接口+会员=是才加 Pinia/Zustand / `--pinia`。
3. **纯静态 YAGNI** — 不加 axios/env/proxy/request/会员/登录页。
4. **PC+自适应** — viewport+媒体查询,不引入 rem 体系;**移动 H5** Sass 必须 flexible+pxtorem(75)。
5. **有接口** — `.env*`+`env.ts`+request 多实例+dev proxy 四件套齐全。
6. **UI 装必注册**;**DefaultLayout+路由按框架落地**。
7. **设计纪律必落地** — Google Fonts 双字族 + `brand` **十档全配**非紫色阶 + 根容器渐变噪点 + 首页样板含微动效 + **正文/标题/渐变文字浅底对比度 ≥ 4.5:1**(slate-700 起步,渐变止于 brand-500);**禁紫色 / 默认系统字体 / 纯白铺底 / 零动效 / `text-slate-300/400/500` 当正文 / `to-brand-300/400` 当主标题色**。
8. **Vue 路由保底** — 路由全同步 import(覆盖 scaffold 默认懒加载),DefaultLayout 用裸 `<RouterView />`,**默认不上 transition/Suspense**(vue-router 5.x 组合会白屏)。
9. **交付前 dev+build+typecheck 必须通过**;SPA 路由切换属客户端行为,显式告知用户手测。
10. **骨架必带中文注释** — 严格按「步骤 0」清单与示例风格落地:WHY 不 WHAT、中文为主、文件头三段式、禁废话注释;清单缺一视为未完成。
