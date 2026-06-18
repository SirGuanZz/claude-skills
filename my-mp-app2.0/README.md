# my-mp-app2.0

新闻方向微信小程序骨架(uni-app + Vue3 + Vite + TS)。

## 业务方向

新闻(news) — tabBar = 首页 / 频道 / 我的;首页样板为渐变 hero + 头条大卡 + 资讯列表。
方向定义在 `src/config/biz.ts`,改 type 须同步 `pages.json` 与各 tab 页样板。

## 目录导读(给后续开发者)

| 路径 | 职责 |
|------|------|
| src/config/design.ts | 设计稿 750 / 样式单位 rpx 的全局约定 |
| src/config/biz.ts | 业务方向(news),决定 tabBar 与首页样板 |
| src/config/env.ts | API_MAP / IS_TEST / envVersion 切换;新增域名改这里 |
| src/types/api.d.ts | 后端统一返回结构(按实际后端调整) |
| src/utils/message.ts | 全局 toast/loading 出口,禁页面裸 uni.showToast |
| src/api/request.ts | 统一请求,4001/401/loading/fail 拦截;**禁直接 uni.request** |
| src/api/modules/news.ts | 资讯接口(main + cms 跨域名调用示例) |
| src/api/modules/user.ts | 登录 / 短信验证码 / 一键登录手机号解密 |
| src/uni.scss | 设计 token(brand 占位非紫色阶 / 字号阶 / 间距阶 / 字族) |
| src/pages.json#pages[0] index/index | 首页(新闻样板,可整体替换) |
| src/pages.json#pages[1] channel/channel | 频道页(订阅 + 推荐) |
| src/pages.json#pages[2] mine/mine | 我的页(头像 + 入口 + 设置) |
| src/pages.json#pages[3] login/login | 登录页,**不进 tabBar**;被 4001/401 跳转 |
| src/pages.json#tabBar.list | 顺序与首页/频道/我的对应,改 biz.ts 须同步 |
| manifest.json#mp-weixin.appid | 上线前在微信公众平台申请并填入,develop 模式可空跑 |

## 开发

```bash
npm install
npm run dev:mp-weixin     # 编译产物 dist/dev/mp-weixin → 微信开发者工具打开
npm run build:mp-weixin   # 生产产物 dist/build/mp-weixin
```

微信开发者工具:导入项目目录选 `dist/dev/mp-weixin`,**勾选「不校验合法域名」**(开发期占位域名才能调通)。

## 设计稿

750 设计稿,样式单位统一 `rpx`。设计稿标注 N px → 写 `${N}rpx`。
**禁** 引入 postcss-pxtorem;**禁** 在样式里硬编码颜色与字号(走 `uni.scss` token)。

## 接口域名(多域名)

- 配置文件:`src/config/env.ts` 的 `API_MAP`
- 当前占位:`main`(主资讯) / `cms`(频道/内容)
- 切换规则:
  - `develop` / `trial` 环境 + `IS_TEST=true` → 走 `test` 域名
  - `release` 环境 → **恒走 `prod`**
- 新增域名:在 `API_MAP` 加 key,再在 `api/modules/*.ts` 用 `request({ api: '<key>', ... })`
- 上线前:微信公众平台「开发管理 → 服务器域名」配置 request 合法域名

## 登录页

- 路径:`/pages/login/login`,**不在 tabBar**
- 入口:被 `request` 拦截器 4001/401 自动跳转,或 `mine` 页「登录/注册」按钮
- 含:手机号 + 验证码 + 60s 倒计时;`<button open-type="getPhoneNumber">` 一键登录(后端解密接口待接)
- 登录成功:`uni.setStorageSync('token', ...)` 后即刻被 `request` header 读到,无需重启

## 设计纪律(继承自 `~/.claude/CLAUDE.md`)

- **字体**:系统字体堆叠(PingFang SC / SF Pro Display 优先),正文与标题分用 `--font-sans` / `--font-display` 拉层次
- **主色**:占位 brand 色阶在 `uni.scss`(cyan/sky 系,非紫),按品牌替换
- **背景**:页面用渐变 + 装饰光斑(`linear-gradient` + 模糊光斑),禁纯白纯灰大面积铺底
- **动效**:按钮 `:active` `transform: scale(0.98)` + `transition 200ms ease-out`,卡片点击有反馈
- **rpx**:全用 rpx,标题字号 ≥ 36rpx,正文 ≥ 28rpx
- **禁**:紫色背景或主题色 / 默认字体一锅煮 / 零动效页面 / 硬编码颜色字号

## 待替换 / 待接清单

- [ ] `manifest.json#mp-weixin.appid` 填入真实 appid
- [ ] `config/env.ts` 域名替换为业务真实域名
- [ ] 后端登录与一键登录解密接口接通(`api/modules/user.ts`)
- [ ] 微信公众平台配置 request 合法域名
- [ ] 业务壳替换:首页 demo 数据 → `getNewsFeed`;频道 demo → `getChannelList`
- [ ] brand 主题色(占位非紫,按品牌替换 `uni.scss` 的 `$color-brand-*`)
- [ ] tabBar 图标(当前 text-only,后续可在 `pages.json#tabBar.list[i]` 加 `iconPath` / `selectedIconPath`,放进 `src/static/`)
