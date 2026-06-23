---
name: mp-project-init
description: >-
  用 uni-app 从 0 创建微信小程序项目骨架(Vue3+Vite+TS),
  含多域名拦截器、业务方向(商城/新闻/视频)、登录页、tabBar、rpx 适配、骨架中文注释与 README 目录导读。
  Use when the user says "新建小程序", "初始化小程序", "起个微信小程序",
  "搭小程序架子", "小程序项目", or /mp-project-init.
  答完 5 个问题后自动一口气执行到底,不再二次确认。
---

# mp-project-init: uni-app 微信小程序从零初始化

用 **uni-app(Vue3 + Vite + TS)** 从 0 起微信小程序骨架：脚手架 → 多域名拦截器 → 登录页 → tabBar → 编译验证。

**核心纪律**：**只问 5 个问题，答完立刻一口气跑到底**——`degit` 脚手架、`npm install`、写代码、`dev:mp-weixin` + `build:mp-weixin`，全程不暂停。编译产物导入微信开发者工具验证。

---

## 技术栈（固定,不问）

| 项 | 值 |
|----|-----|
| 框架 | uni-app + Vue3 + Vite + TypeScript |
| 目标端 | 微信小程序(`mp-weixin`) |
| 设计稿 | 750,rpx |
| 请求 | `uni.request` 封装,无 dev proxy |

**登录页**：**默认必有**(不依赖问题 4 会员),含手机号+验证码+本机号码一键登录。  
**Pinia**：仅问题 4 选「是」时装;登录态 `pinia-plugin-persistedstate` + `uni.setStorageSync`。

**设计纪律(默认按用户级 `~/.claude/CLAUDE.md` 落地)**:小程序受网络字体限制,不引 Google Fonts,改为系统字体堆叠 + token 化样式:
- **字体**:`uni.scss` 定义 `--font-sans` / `--font-display`,优先 PingFang SC / SF Pro Display,正文与标题用不同字重拉开层次,**禁默认系统字号字重一锅煮**。
- **配色**:`uni.scss` 定义 `--color-brand` 非紫色阶(占位 `#0EA5E9` 系)+ 中性色阶,禁默认紫蓝渐变。
- **背景**:页面根容器渐变 + 装饰光斑(用 `view` + `linear-gradient` / `radial-gradient`),禁纯白纯灰大面积铺底。
- **动效**:按钮 `:active` 微缩放(`transform: scale(0.98)`)+ `transition` 200ms,卡片点击有反馈。
- **rpx**:全用 rpx,设计稿 750,标题字号 ≥ 36rpx,正文 ≥ 28rpx。

---

## 启动：问答收集需求（只此一轮,答完即开工）

用 `AskUserQuestion` **一次**收齐 5 项,答完**同一轮**开始执行,禁止再确认。

| # | 问题 | 选项/说明 |
|---|------|----------|
| 1 | 小程序方向 | 商城 / 新闻 / 视频 / 其他(追问一句业务描述) |
| 2 | 样式 | scss(默认) / css |
| 3 | 接口域名 | 名称+prod 地址,有测试环境则加 test;未提供 → 按方向默认(见下表) |
| 4 | 会员管理 | 是→Pinia+登录态+路由拦截;否→仅登录页骨架,token 用 `uni.setStorageSync` |
| 5 | 项目名+目录 | 默认 `./<项目名>` |

**默认值**：方向=商城,样式=scss。

### 方向 × 页面决策表（问答结束后按此生成 tabBar + 首页样板）

| 方向 | tabBar(不含登录) | 额外页面(占位) | 首页样板要点 | 域名默认(未提供时) |
|------|-----------------|---------------|-------------|------------------|
| 商城 | 首页 / 分类 / 购物车 / 我的 | `category` `cart` `mine` | 顶部搜索条 + 轮播 + 双列商品卡(图+标题+价) | `main`+`user` |
| 新闻 | 首页 / 频道 / 我的 | `channel` `mine` | 置顶头条大卡 + 新闻列表(标题+来源+时间) | `main`+`cms` |
| 视频 | 首页 / 发现 / 我的 | `discover` `mine` | 视频 feed(16:9 封面+播放量+标题) | `main`+`media` |
| 其他 | 首页 / 我的 | `mine` | 渐变 hero + 2~3 功能入口卡(按用户描述命名) | `main`+`user` |

- `src/config/biz.ts` 记录 `bizType:'mall'|'news'|'video'|'custom'` 与 `bizLabel`,README 与报告写明方向。
- 所有方向:**登录页不进 tabBar**;`mine` 页放头像/登录入口占位(会员=是接 store)。
- tabBar 图标 `static/tab-*.png` 占位即可;`pages.json` 第一项为首页。

---

## 步骤 0：代码注释规范（开工前必读）

骨架代码须让**后续接手的人不读 SKILL 也能懂**。先看完本节再写任何文件。

### 风格铁律(4 条,继承自用户级 `~/.claude/CLAUDE.md`)

1. **WHY 不 WHAT** — 解释为什么这样写(约束、副作用、修改注意),不解释字面在做什么(变量/函数名能看懂的别注)。
2. **中文为主,术语保留英文** — baseURL / token / envVersion / rpx / tabBar / openid 等不翻译。
3. **文件头三段式** — `职责` + `依赖方(谁读它)` + `修改注意点(改这里同步改哪里)`,缺一不可。
4. **禁废话注释** — "定义变量"/"调用函数"/"导入 store"/"创建 pinia" 一律不写。

### 必加注释文件清单(按生成顺序)

| 文件 | 必加内容 | 条件 |
|------|---------|------|
| `src/config/design.ts` | 文件头三段式(750 稿与 rpx 换算规则) | 必 |
| `src/config/biz.ts` | 文件头三段式(方向 → tabBar/首页样板对应关系;改 type 同步 pages.json) | 必 |
| `src/config/env.ts` | 文件头三段式 + `IS_TEST` / `envVersion` / `API_MAP` 切换逻辑 + 每个 key 业务含义 | 必 |
| `src/types/api.d.ts` | `ApiResponse` 注「按后端实际结构调整」+ 字段含义 | 必 |
| `src/utils/message.ts` | 文件头(为何统一封装 toast,禁页面裸 `uni.showToast`) | 必 |
| `src/api/request.ts` | 文件头三段式 + 调用示例 + 请求/4001/401/loading/fail 分段标注 + 登录页 path | 必 |
| `src/api/modules/*.ts` | 每个导出函数 JSDoc(`@param`/`@returns` + 业务说明,跨域名调用注明 `api` key) | 必 |
| `src/stores/user.ts` | 文件头(持久化字段 / token 与 request header 的关系 / login/logout 副作用) | 会员=是 |
| `src/uni.scss` | 颜色/字号/间距/字族各 token 区块分区注释;brand 注「占位色,按品牌替换」 | 必 |
| `src/pages/login/login.vue` | 文件头 + 验证码倒计时 / 提交登录 / 一键登录解密 三段标注 + 待接位置 | 必 |
| `src/pages/index/index.vue` | 文件头标注「按方向 {bizType} 生成的样板,可整体替换」 | 必 |
| 其他 tab 页(`mine`/`category` 等) | 文件头一行说明职责 | 必 |
| `manifest.json` | `mp-weixin.appid` 行旁注「上线前在微信公众平台申请并填入」(JSON 不能写注释 → 在 README 补) | 必 |
| `src/pages.json` | JSON 不能注释 → 在 README「目录导读」表逐项列 `pagePath` 职责与 tabBar 归属 | 必 |
| `README.md` | 「目录导读」表(含 pages 职责映射)+「设计纪律 cheatsheet」 | 必 |

### 风格示例(直接照抄)

**1. 文件头三段式(所有 config / api / store / 页面必做)**

```ts
/**
 * 业务方向 — 决定 tabBar 结构 与 首页样板形态(商城/新闻/视频/自定义)
 * 依赖方:pages.json tabBar.list 顺序、pages/index 样板、README 目录导读
 * 修改注意:改 type 须同步 pages.json + 各 tab 页占位 + 报告里的方向描述
 */
```

**2. 接口函数 JSDoc(`api/modules/*`,跨域名注明 api key)**

```ts
/**
 * 获取当前登录用户信息
 * @returns 用户基础资料 + 角色码;401/4001 由 request 拦截器统一跳 /pages/login/login,无需调用方处理
 */
export const getUserInfo = () => request<UserInfo>({ api: 'user', url: 'user/info', loading: false })
```

**3. `request.ts` 分段标注**

```ts
// --- 请求前:拼 baseURL、附加 Authorization+token、可选 loading mask ---
// --- 4001 未登录:静默跳 /pages/login/login(避免重复跳已在登录页) ---
// --- 401 登录过期:清 token + 弹一次 modal 提示重新登录 ---
// --- code !== 0:业务失败 → showError(msg) 并 reject ---
// --- complete:统一 hideLoading,fail/success 都走 ---
```

**4. `pages/login/login.vue` 流程分段**

```vue
<script setup lang="ts">
// --- 倒计时:60s 内禁用「获取验证码」,防重复点击;leaveBeforeUnmount 清 timer ---
// --- 提交登录:走 user 域名,成功写 token + setStorageSync,跳回上一页或首页 ---
// --- 一键登录:open-type=getPhoneNumber → wx.login code → 后端解密(待接,见 TODO) ---
</script>
```

**5. `manifest.json` 与 `pages.json`(JSON 不能注释 → README 目录导读补)**

README 里固定一段:

```markdown
## 目录导读
| 路径 | 职责 |
|------|------|
| manifest.json#mp-weixin.appid | 上线前在微信公众平台申请并填入,develop 模式可空跑 |
| src/pages.json#pages[0] index/index | 首页(按 {bizType} 生成的样板) |
| src/pages.json#tabBar.list | tabBar 顺序与首页/分类/购物车/我的对应,改了 biz.ts 须同步 |
| src/pages/login/login.vue | 登录页,**不进 tabBar**,被 4001/401 拦截器跳转目标 |
```

**6. 禁止的废话注释(反例 vs 正例)**

```ts
// ❌ 反例:在说"做了什么",删
// 导入 pinia
import { createPinia } from 'pinia'
// 创建 user store
export const useUserStore = defineStore(...)

// ✅ 正例:解释"为什么"
// token 走 setStorageSync 而非 pinia 内存:request header 同步读,小程序冷启动也要立即可用
const token = uni.getStorageSync('token')
```

---

## 执行清单（全部 ✓ 后再出报告）

```
□ 1. npx degit dcloudio/uni-preset-vue#vite-ts + npm install
□ 2. vite.config.ts 配 scss modern-compiler,消除 legacy-js-api 警告
□ 3. .gitignore 含 node_modules / dist / unpackage / .env.local
□ 4. src/config/{design,biz}.ts — 750 rpx + 业务方向
□ 5. src/uni.scss 设计 token: --color-brand(非紫) / --font-sans / --font-display / 字号阶 / 间距阶
□ 6. src/config/env.ts — API_MAP + IS_TEST + envVersion
□ 7. src/types/api.d.ts + src/utils/message.ts + src/api/request.ts
□ 8. 按方向生成 pages(首页样板 + login + tabBar 子页) + login 不进 tabBar
□ 9. src/pages.json pages + tabBar;manifest.json mp-weixin 基本配置
□ 10. 会员模块 stores/user.ts(若选是)
□ 11. 按「步骤 0」清单逐项加注释(文件头三段式 / request 4001-401-loading 分段 / 函数 JSDoc / login 流程分段 / pages.json+manifest.json 职责映射进 README),清单缺一即未通过
□ 12. 项目 README.md(含方向说明 + 目录导读 + 设计纪律 cheatsheet)
□ 13. npm run dev:mp-weixin + npm run build:mp-weixin 通过
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
    biz.ts
    env.ts
  types/
    api.d.ts
  utils/
    message.ts
  api/
    request.ts
    modules/example.ts
  pages/               # 按方向生成,商城示例:
    index/index.vue
    category/category.vue
    cart/cart.vue
    mine/mine.vue
    login/login.vue
  stores/              # 会员=是
    user.ts
```

`index.html` 为 uni-app H5 编译用,**小程序运行不依赖它**;保留脚手架原文件即可,勿当小程序入口。

### 依赖（按需装）

| 用途 | 包 |
|------|-----|
| 会员 | pinia + pinia-plugin-persistedstate(问题 4=是) |

---

## 步骤 2：设计稿适配

### `src/config/design.ts`

```ts
/**
 * 设计稿约定 — 小程序统一 750 稿,样式单位 rpx
 * 设计稿标注 N px → 样式写 N rpx
 */
export const DESIGN = {
  designWidth: 750,
  unit: 'rpx',
} as const
```

样式全用 `rpx`(设计稿 32px → `32rpx`);禁止 postcss-pxtorem。

### `src/config/biz.ts`

```ts
/**
 * 业务方向 — 决定 tabBar 与首页样板(商城/新闻/视频/自定义)
 * 改 type 须同步 pages.json 与各 pages 占位
 */
export type BizType = 'mall' | 'news' | 'video' | 'custom'

export const BIZ = {
  type: 'mall' as BizType,
  label: '商城',
} as const
```

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
/**
 * 小程序域名配置 — 无 dev proxy,直连 getApiBase
 * - IS_TEST: develop/trial 下切换测试/正式域名;release 恒走 prod
 * - 新增 api key:在本文件 API_MAP 加一项,request 里用 options.api 引用
 * - 上线前在微信公众平台配置 request 合法域名
 */
export const IS_TEST = true // develop/trial: true=测试 false=正式;release 忽略

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

按**方向决策表**生成 `pages` 与 `tabBar`。登录页始终注册,**不进** `tabBar.list`。

### 商城 `pages.json` 示例

```json
{
  "pages": [
    { "path": "pages/index/index", "style": { "navigationBarTitleText": "首页" } },
    { "path": "pages/category/category", "style": { "navigationBarTitleText": "分类" } },
    { "path": "pages/cart/cart", "style": { "navigationBarTitleText": "购物车" } },
    { "path": "pages/mine/mine", "style": { "navigationBarTitleText": "我的" } },
    { "path": "pages/login/login", "style": { "navigationBarTitleText": "登录" } }
  ],
  "tabBar": {
    "list": [
      { "pagePath": "pages/index/index", "text": "首页", "iconPath": "static/tab-home.png", "selectedIconPath": "static/tab-home-active.png" },
      { "pagePath": "pages/category/category", "text": "分类", "iconPath": "static/tab-category.png", "selectedIconPath": "static/tab-category-active.png" },
      { "pagePath": "pages/cart/cart", "text": "购物车", "iconPath": "static/tab-cart.png", "selectedIconPath": "static/tab-cart-active.png" },
      { "pagePath": "pages/mine/mine", "text": "我的", "iconPath": "static/tab-mine.png", "selectedIconPath": "static/tab-mine-active.png" }
    ]
  }
}
```

新闻 / 视频 / 其他按决策表替换 tab 项与页面 path;结构同上。

tabBar 图标用占位图;`pages` 数组第一项为首页。

### 首页与各 tab 页样板(按方向,禁裸 demo)

| 方向 | 首页 `index` | 其他 tab 页 |
|------|-------------|------------|
| 商城 | 搜索条 + 轮播 + 双列商品卡(图+标题+价,`:active` 缩放) | 分类:左侧类目+右侧商品列表;购物车:勾选+合计栏;我的:头像区+订单入口 |
| 新闻 | 置顶头条大卡 + 新闻列表(标题+来源+时间) | 频道:频道 grid;我的:订阅/收藏入口 |
| 视频 | 视频 feed(16:9 封面+播放量+标题,双列或单列) | 发现:话题/推荐 tab;我的:观看历史入口 |
| 其他 | 渐变 hero + 2~3 功能入口卡(按 `biz.label` 命名) | 我的:通用用户中心占位 |

共用:`uni.scss` token、渐变/卡片样式、按钮 `:active { transform: scale(0.98) }`、字号≥2 层。

### `src/manifest.json`

确认 `mp-weixin` 节点存在;`appid` 留空或占位,报告提醒用户填入。

会员=是:在 `main.ts` 注册 Pinia;需登录页在 `onShow` 或全局拦截检查 token。

---

## 步骤 6：会员模块（仅问题 4=是）

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

生成 **25~45 行** README:

```markdown
# {项目名}
## 业务方向
{BIZ.label}({BIZ.type}) — tabBar 与首页样板已按此生成
## 目录导读(给后续开发者)
| 路径 | 职责 |
|------|------|
| src/config/biz.ts | 业务方向,决定 tabBar 结构 |
| src/config/env.ts | API_MAP / IS_TEST / 域名切换 |
| src/api/request.ts | 统一请求,页面勿直接 uni.request |
| src/pages.json | 页面注册与 tabBar(pages.json 无法写注释,见本表) |
| src/pages/login/ | 登录页,不进 tabBar |
| src/uni.scss | 设计 token(颜色/字号/间距) |
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
| 样式含 rpx;tabBar 与方向一致可切换;登录页可跳转 |
| 登录页含手机号/验证码/一键登录 |
| `getApiBase` 随 envVersion+IS_TEST 切换 |
| 设计纪律: uni.scss 含 brand 非紫色阶 / 字号阶 / 系统字体堆叠;首页含渐变 banner 与字号≥2 层;按钮含 :active 微动效 |
| 代码注释 | 按「步骤 0」清单逐项核对:文件头三段式 / `request.ts` 4001-401-loading-fail 分段 / 接口函数 JSDoc / login 流程分段 / `manifest.json` appid 标注 / README 目录导读+pages 职责映射,缺一即未通过 |

失败 → 自行修到 build 通过。

---

## 完成报告（只输出一次）

```
✅ 小程序 {名称} 已初始化 (uni-app)

📦 Vue3 + Vite + TS + mp-weixin + 方向({商城/新闻/视频/自定义})
🌐 API_MAP 域名列表(prod/test)
📁 关键文件清单(tabBar 页面列表)
📝 已加多人协作注释 + README 目录导读
🎨 设计纪律: 系统字体堆叠 / brand 占位色 / 渐变 banner / 已落地
🚀 npm run dev:mp-weixin → 微信开发者工具打开 dist/dev/mp-weixin
⚠️ 待替换:manifest appid / 域名 / 业务壳 / 手机号解密 / 合法域名 / brand 主题色(占位非紫,按品牌换)
📋 采用的默认值
```

---

## 铁律

1. **5 问收齐 → 一口气跑完清单**,中间不确认;**方向决定 tabBar 与首页样板**。
2. **固定 uni-app 脚手架**,禁止手写原生 `app.js`/`wxml` 替代。
3. **默认必有登录页**(手机号验证码+一键登录),不进 tabBar。
4. **多域名**:`API_MAP`+`IS_TEST`+`__wxConfig.envVersion`,统一 `request(options.api)`,无 proxy。
5. **scss 必配 modern-compiler**;**会员=否不加 Pinia**。
6. **设计纪律必落地** — `uni.scss` 写 `brand` 非紫色阶 + 字号阶 + 系统字体堆叠;登录页 + 首页有渐变 banner 与字层次;按钮含 `:active` 微动效;**禁紫色 / 默认字体一锅煮 / 纯白铺底 / 硬编码颜色字号**。
7. **交付前 dev:mp-weixin + build:mp-weixin 必须通过**。
8. **骨架必带中文注释** — 严格按「步骤 0」清单与示例风格落地:WHY 不 WHAT、中文为主、文件头三段式、禁废话注释;清单缺一视为未完成。
9. **输出风格** — 中文回复 / 进度更新 / 完成报告 / README 一律**避免使用斜体**(`*文字*` / `_文字_`);需要强调统一用粗体,引用文件 / 命令 / 字段名用反引号。代码注释里也不要用斜体强调。
