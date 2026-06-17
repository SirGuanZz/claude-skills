---
name: mp-project-init
description: >-
  用 uni-app 从 0 创建微信小程序项目骨架(Vue3+Vite+TS),
  含多域名拦截器(envVersion+IS_TEST)、登录页、tabBar、rpx 适配。
  Use when the user says "新建小程序", "初始化小程序", "起个微信小程序",
  "搭小程序架子", "小程序项目", or /mp-project-init.
  答完 4 个问题后自动一口气执行到底,不再二次确认。
---

# mp-project-init: uni-app 微信小程序从零初始化

用 **uni-app(Vue3 + Vite + TS)** 从 0 起微信小程序骨架：脚手架 → 多域名拦截器 → 登录页 → tabBar → 编译验证。

**核心纪律**：**只问 4 个问题，答完立刻一口气跑到底**——`degit` 脚手架、`npm install`、写代码、`dev:mp-weixin` + `build:mp-weixin`，全程不暂停。编译产物导入微信开发者工具验证。

---

## 技术栈（固定,不问）

| 项 | 值 |
|----|-----|
| 框架 | uni-app + Vue3 + Vite + TypeScript |
| 目标端 | 微信小程序(`mp-weixin`) |
| 设计稿 | 750,rpx |
| 请求 | `uni.request` 封装,无 dev proxy |

**登录页**：**默认必有**(不依赖问题 3),含手机号+验证码+本机号码一键登录。  
**Pinia**：仅问题 3 选「是」时装;登录态 `pinia-plugin-persistedstate` + `uni.setStorageSync`。

**设计纪律(默认按用户级 `~/.claude/CLAUDE.md` 落地)**:小程序受网络字体限制,不引 Google Fonts,改为系统字体堆叠 + token 化样式:
- **字体**:`uni.scss` 定义 `--font-sans` / `--font-display`,优先 PingFang SC / SF Pro Display,正文与标题用不同字重拉开层次,**禁默认系统字号字重一锅煮**。
- **配色**:`uni.scss` 定义 `--color-brand` 非紫色阶(占位 `#0EA5E9` 系)+ 中性色阶,禁默认紫蓝渐变。
- **背景**:页面根容器渐变 + 装饰光斑(用 `view` + `linear-gradient` / `radial-gradient`),禁纯白纯灰大面积铺底。
- **动效**:按钮 `:active` 微缩放(`transform: scale(0.98)`)+ `transition` 200ms,卡片点击有反馈。
- **rpx**:全用 rpx,设计稿 750,标题字号 ≥ 36rpx,正文 ≥ 28rpx。

---

## 启动：问答收集需求（只此一轮,答完即开工）

用 `AskUserQuestion` **一次**收齐 4 项,答完**同一轮**开始执行,禁止再确认。

| # | 问题 | 选项/说明 |
|---|------|----------|
| 1 | 样式 | scss(默认) / css |
| 2 | 接口域名 | 名称+prod 地址,有测试环境则加 test;未提供 → `main`+`user` 占位 |
| 3 | 会员管理 | 是→Pinia+登录态+路由拦截;否→仅登录页骨架,token 用 `uni.setStorageSync` |
| 4 | 项目名+目录 | 默认 `./<项目名>` |

**默认值**：样式=scss,域名=main+user 占位。

---

## 执行清单（全部 ✓ 后再出报告）

```
□ 1. npx degit dcloudio/uni-preset-vue#vite-ts + npm install
□ 2. vite.config.ts 配 scss modern-compiler,消除 legacy-js-api 警告
□ 3. .gitignore 含 node_modules / dist / unpackage / .env.local
□ 4. src/config/design.ts — 750 rpx
□ 5. src/uni.scss 设计 token: --color-brand(非紫) / --font-sans / --font-display / 字号阶 / 间距阶
□ 6. src/config/env.ts — API_MAP + IS_TEST + envVersion
□ 7. src/types/api.d.ts + src/utils/message.ts + src/api/request.ts
□ 8. src/pages/index(渐变 hero + 字层次 + 卡片样板) + src/pages/login(手机号/验证码/一键登录,渐变背景,不进 tabBar)
□ 9. src/pages.json pages + tabBar;manifest.json mp-weixin 基本配置
□ 10. 会员模块 stores/user.ts(若选是)
□ 11. 项目 README.md(含设计纪律 cheatsheet)
□ 12. npm run dev:mp-weixin + npm run build:mp-weixin 通过
```

---

## 步骤 1：脚手架 + 基础工程

### 脚手架

```bash
npx degit dcloudio/uni-preset-vue#vite-ts <name>
cd <name> && npm install
```

非交互;失败 → 换镜像 / `--legacy-peer-deps` / 删 lock 重装。

### `vite.config.ts`（立刻改,消 Sass 警告）

```ts
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
  plugins: [uni()],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        silenceDeprecations: ['legacy-js-api'],
      },
    },
  },
})
```

样式选 css 时可删 scss 配置。

### `package.json` scripts（确认存在）

```json
{
  "dev:mp-weixin": "uni -p mp-weixin",
  "build:mp-weixin": "uni build -p mp-weixin"
}
```

脚手架已有则不改;缺则补上。

### 目录约定

```
src/
  App.vue
  main.ts
  pages.json
  manifest.json
  uni.scss
  config/
    design.ts
    env.ts
  types/
    api.d.ts
  utils/
    message.ts
  api/
    request.ts
    modules/example.ts
  pages/
    index/index.vue
    login/login.vue
  stores/              # 会员=是
    user.ts
```

`index.html` 为 uni-app H5 编译用,**小程序运行不依赖它**;保留脚手架原文件即可,勿当小程序入口。

### 依赖（按需装）

| 用途 | 包 |
|------|-----|
| 会员 | pinia + pinia-plugin-persistedstate(问题 3=是) |

---

## 步骤 2：设计稿适配

### `src/config/design.ts`

```ts
export const DESIGN = {
  designWidth: 750,
  unit: 'rpx',
} as const
```

样式全用 `rpx`(设计稿 32px → `32rpx`);禁止 postcss-pxtorem。

### `src/uni.scss`(全局设计 token,默认必写)

落地用户级 `~/.claude/CLAUDE.md` 的设计纪律:

```scss
/* ===== 颜色:占位 brand 非紫色阶,按品牌替换 ===== */
$color-brand-50:  #F0F9FF;
$color-brand-100: #E0F2FE;
$color-brand-500: #0EA5E9;
$color-brand-600: #0284C7;
$color-brand-700: #0369A1;
$color-text:      #0F172A;
$color-text-soft: #475569;
$color-bg:        #F8FAFC;

/* ===== 字号阶(rpx) ===== */
$fs-display: 56rpx;
$fs-h1:      44rpx;
$fs-h2:      36rpx;
$fs-body:    28rpx;
$fs-caption: 24rpx;

/* ===== 间距阶 ===== */
$space-1: 8rpx; $space-2: 16rpx; $space-3: 24rpx; $space-4: 32rpx; $space-6: 48rpx; $space-8: 64rpx;

/* ===== 圆角 ===== */
$radius-md: 16rpx;
$radius-lg: 24rpx;
$radius-xl: 32rpx;

/* ===== 字族:小程序无 Google Fonts,系统字体堆叠拉差异化 ===== */
:root {
  --font-sans:    "PingFang SC", -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Microsoft YaHei", sans-serif;
  --font-display: "PingFang SC", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif;
}
page { font-family: var(--font-sans); color: $color-text; background: $color-bg; }
```

字号、颜色、间距全部走 token,禁页面里硬编码颜色与字号。css 项目同样把这套 token 写进 `app.vue` 的全局 `<style>`。

---

## 步骤 3：环境变量与拦截器

### `src/config/env.ts`

```ts
export const IS_TEST = true // develop/trial 下 true=测试 false=正式;release 忽略

export const API_MAP = {
  main:  { prod: 'https://api.example.com/api/',  test: 'https://api-test.example.com/api/' },
  user:  { prod: 'https://user.example.com/api/', test: 'https://user-test.example.com/api/' },
  wxapi: { prod: 'https://wxapi.example.com/api/' },
} as const

export type ApiKey = keyof typeof API_MAP

export function getEnvVersion(): 'develop' | 'trial' | 'release' {
  // @ts-expect-error 微信小程序运行时注入
  return __wxConfig?.envVersion ?? 'develop'
}

export function isDevOrTrial() {
  const v = getEnvVersion()
  return v === 'develop' || v === 'trial'
}

export function getApiBase(key: ApiKey): string {
  const c = API_MAP[key]
  return isDevOrTrial() && IS_TEST && 'test' in c && c.test ? c.test : c.prod
}
```

**域名切换**：`__wxConfig.envVersion` — `develop` / `trial` / `release`;`release` 恒 prod。

### `src/types/api.d.ts`

```ts
export interface ApiResponse<T = unknown> {
  code: number
  data: T
  msg: string
}
```

### `src/utils/message.ts`

```ts
export function showError(msg: string) {
  uni.showToast({ title: msg, icon: 'none' })
}
export function showSuccess(msg: string) {
  uni.showToast({ title: msg, icon: 'success' })
}
```

### `src/api/request.ts`

统一 `request<T>(options)`:

```ts
import { getApiBase, type ApiKey } from '@/config/env'
import type { ApiResponse } from '@/types/api'
import { showError } from '@/utils/message'

type RequestOptions = {
  api: ApiKey
  url: string
  method?: UniApp.RequestOptions['method']
  data?: Record<string, unknown>
  loading?: string | boolean
  homeToken?: boolean
  token?: string
}

let tipLogin = 1

export function request<T = unknown>(options: RequestOptions): Promise<ApiResponse<T>> {
  const baseURL = getApiBase(options.api)
  if (options.loading) {
    uni.showLoading({ title: typeof options.loading === 'string' ? options.loading : '加载中...', mask: true })
  }
  const token = options.token || uni.getStorageSync('token')
  let authorization = `Bearer ${token}`

  return new Promise((resolve, reject) => {
    uni.request({
      url: baseURL + options.url,
      method: options.method || 'GET',
      data: options.data,
      timeout: 15000,
      header: {
        Authorization: authorization,
        token: token || '',
        // 业务方按需启用:
        // UnionId: uni.getStorageSync('unionId') || '',
        // OpenId: uni.getStorageSync('openId') || '',
      },
      success(res) {
        const data = res.data as ApiResponse<T>
        if (data.code === 4001 && !options.homeToken) {
          const pages = getCurrentPages()
          const route = pages[pages.length - 1]?.route
          if (route !== 'pages/login/login') {
            uni.navigateTo({ url: '/pages/login/login' })
          }
          return
        }
        if (data.code === 401 && !options.homeToken) {
          uni.removeStorageSync('token')
          if (tipLogin === 1) {
            tipLogin++
            uni.showModal({
              content: '您的登录已过期，请重新登录！',
              success(r) {
                if (r.confirm) uni.navigateTo({ url: '/pages/login/login' })
              },
            })
          }
          reject(data)
          return
        }
        if (data.code !== 0) {
          showError(data.msg || '请求失败')
          reject(data)
          return
        }
        resolve(data)
      },
      fail(err) {
        showError('请求失败')
        reject(err)
      },
      complete() {
        uni.hideLoading()
      },
    })
  })
}
```

无 dev proxy;特殊 api 的 Authorization 用 `switch(options.api)` 扩展。`api/modules/example.ts` 放跨域名调用示例。

---

## 步骤 4：登录页（默认必有）

`src/pages/login/login.vue`,**不进 tabBar**。须含:

- 手机号 `input` + 验证码 `input` + 「获取验证码」按钮(倒计时占位)
- 「登录」按钮 → `request({ api: 'user', url: '...', method: 'POST' })`
- 「本机号码一键登录」— `<button open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber">`,解密逻辑注释待接

**视觉要求(默认必做)**:
- 顶部渐变 hero 区(`linear-gradient` from `$color-brand-500` to `$color-brand-700`),内含 logo 占位 + 大字标题(`$fs-display` + `--font-display`)+ 副标题(`$fs-body` + `$color-text-soft`)
- 表单区圆角卡片(`$radius-xl`)悬浮在 hero 下方,白底 + 阴影 + 字段间距 `$space-4`
- 主 CTA 按钮 `:active { transform: scale(0.98); transition: transform 200ms }`,背景 `$color-brand-500`,字色白
- 「一键登录」用次级样式(描边按钮),与主 CTA 形成层次

`pages.json` 注册路径,**不要**放进 `tabBar.list`。

---

## 步骤 5：pages.json + tabBar + manifest

### `src/pages.json`

```json
{
  "pages": [
    { "path": "pages/index/index", "style": { "navigationBarTitleText": "首页" } },
    { "path": "pages/login/login", "style": { "navigationBarTitleText": "登录" } }
  ],
  "tabBar": {
    "list": [
      { "pagePath": "pages/index/index", "text": "首页", "iconPath": "static/tab-home.png", "selectedIconPath": "static/tab-home-active.png" }
    ]
  }
}
```

tabBar 图标用占位图或 uni 默认;登录页与 tabBar **互斥**。

### 首页样板(`pages/index/index.vue`,默认必做)

**禁裸文字 demo**。须含:

- 顶部渐变 banner(`$color-brand-500` → `$color-brand-700` 渐变,圆角下沿 `$radius-xl`),内含欢迎大字标题(`$fs-display` + `--font-display`)+ 一行副标题
- 卡片网格区:2~3 张功能入口卡(白底 + `$radius-lg` + 阴影 + `:active { transform: scale(0.98) }`),卡内图标占位 + 标题(`$fs-h2`)+ 描述(`$fs-caption` + `$color-text-soft`)
- 间距用 `$space-*` token,字号≥2 层,字重≥2 层

### `src/manifest.json`

确认 `mp-weixin` 节点存在;`appid` 留空或占位,报告提醒用户填入。

会员=是:在 `main.ts` 注册 Pinia;需登录页在 `onShow` 或全局拦截检查 token。

---

## 步骤 6：会员模块（仅问题 3=是）

```bash
npm install pinia pinia-plugin-persistedstate
```

`src/stores/user.ts` — `token`/`userInfo`/`isLogin`;actions:`login`/`logout`/`fetchUserInfo`;持久化走 `uni.setStorageSync`。`main.ts`:

```ts
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
// createApp 内: const pinia = createPinia(); pinia.use(piniaPluginPersistedstate); app.use(pinia)
```

---

## 步骤 7：项目 README.md

生成 **20~35 行** README:

```markdown
# {项目名}
## 开发
npm run dev:mp-weixin   # 编译后用微信开发者工具打开 dist/dev/mp-weixin
npm run build:mp-weixin # 产物 dist/build/mp-weixin
## 设计稿
750,rpx
## 接口域名
API_MAP + IS_TEST + envVersion;新增域名改 config/env.ts
## 调试
开发者工具勾选不校验合法域名;上线配置 request 合法域名;填写 manifest appid
## 设计纪律(继承自 ~/.claude/CLAUDE.md)
- 字体:系统字体堆叠(PingFang SC / SF Pro 优先),正文与标题用不同字重拉层次
- 主色:占位 brand 色阶在 uni.scss,按品牌替换
- 背景:渐变 + 装饰光斑,禁纯白纯灰大面积铺底
- 动效:按钮 :active 微缩放 + transition 200ms
- 禁:紫色背景或主题色、零动效页面、硬编码颜色字号
```

---

## 步骤 8：验证

```bash
cd <project>
npm install
npm run dev:mp-weixin
npm run build:mp-weixin
```

| 检查 |
|------|
| `dist/dev/mp-weixin` 生成成功,开发者工具可打开 |
| 无 legacy-js-api Sass 警告(已配 vite scss) |
| 样式含 rpx;tabBar 可切换;登录页可跳转 |
| 登录页含手机号/验证码/一键登录 |
| `getApiBase` 随 envVersion+IS_TEST 切换 |
| 设计纪律: uni.scss 含 brand 非紫色阶 / 字号阶 / 系统字体堆叠;首页含渐变 banner 与字号≥2 层;按钮含 :active 微动效 |

失败 → 自行修到 build 通过。

---

## 完成报告（只输出一次）

```
✅ 小程序 {名称} 已初始化 (uni-app)

📦 Vue3 + Vite + TS + mp-weixin
🌐 API_MAP 域名列表(prod/test)
📁 关键文件清单
🎨 设计纪律: 系统字体堆叠 / brand 占位色 / 渐变 banner / 已落地
🚀 npm run dev:mp-weixin → 微信开发者工具打开 dist/dev/mp-weixin
⚠️ 待替换:manifest appid / 域名 / 业务壳 / 手机号解密 / 合法域名 / brand 主题色(占位非紫,按品牌换)
📋 采用的默认值
```

---

## 铁律

1. **4 问收齐 → 一口气跑完清单 12 项**,中间不确认。
2. **固定 uni-app 脚手架**,禁止手写原生 `app.js`/`wxml` 替代。
3. **默认必有登录页**(手机号验证码+一键登录),不进 tabBar。
4. **多域名**:`API_MAP`+`IS_TEST`+`__wxConfig.envVersion`,统一 `request(options.api)`,无 proxy。
5. **scss 必配 modern-compiler**;**会员=否不加 Pinia**。
6. **设计纪律必落地** — `uni.scss` 写 `brand` 非紫色阶 + 字号阶 + 系统字体堆叠;登录页 + 首页有渐变 banner 与字层次;按钮含 `:active` 微动效;**禁紫色 / 默认字体一锅煮 / 纯白铺底 / 硬编码颜色字号**。
7. **交付前 dev:mp-weixin + build:mp-weixin 必须通过**。
