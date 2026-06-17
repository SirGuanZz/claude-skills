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
□ 5. src/config/env.ts — API_MAP + IS_TEST + envVersion
□ 6. src/types/api.d.ts + src/utils/message.ts + src/api/request.ts
□ 7. src/pages/index + src/pages/login(手机号/验证码/一键登录,不进 tabBar)
□ 8. src/pages.json pages + tabBar;manifest.json mp-weixin 基本配置
□ 9. 会员模块 stores/user.ts(若选是)
□ 10. 项目 README.md(短)
□ 11. npm run dev:mp-weixin + npm run build:mp-weixin 通过
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

样式全用 `rpx`(设计稿 32px → `32rpx`);禁止 postcss-pxtorem。`uni.scss` 可写全局变量。

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
        UnionId: uni.getStorageSync('unionId') || '',
        OpenId: uni.getStorageSync('openId') || '',
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

失败 → 自行修到 build 通过。

---

## 完成报告（只输出一次）

```
✅ 小程序 {名称} 已初始化 (uni-app)

📦 Vue3 + Vite + TS + mp-weixin
🌐 API_MAP 域名列表(prod/test)
📁 关键文件清单
🚀 npm run dev:mp-weixin → 微信开发者工具打开 dist/dev/mp-weixin
⚠️ 待替换:manifest appid / 域名 / 业务壳 / 手机号解密 / 合法域名
📋 采用的默认值
```

---

## 铁律

1. **4 问收齐 → 一口气跑完清单 11 项**,中间不确认。
2. **固定 uni-app 脚手架**,禁止手写原生 `app.js`/`wxml` 替代。
3. **默认必有登录页**(手机号验证码+一键登录),不进 tabBar。
4. **多域名**:`API_MAP`+`IS_TEST`+`__wxConfig.envVersion`,统一 `request(options.api)`,无 proxy。
5. **scss 必配 modern-compiler**;**会员=否不加 Pinia**。
6. **交付前 dev:mp-weixin + build:mp-weixin 必须通过**。
