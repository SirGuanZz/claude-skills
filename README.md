# claude-skills

个人 Agent Skills 仓库，面向 **Vue3 + TypeScript + Nuxt** 与 **uni-app 微信小程序** 的日常开发。同时支持 **Claude Code** 与 **Cursor**。

按 **起项目 → 分析需求 → 写代码 → 审查代码** 四阶段组织，详见 [工作顺序](#工作顺序)。

目录：

- [Skills 详解](#skills-详解)
  - [`fe-project-init`](#fe-project-init)
  - [`mp-project-init`](#mp-project-init)
  - [`req-analyze`](#req-analyze)
  - [`vue-component-gen`](#vue-component-gen)
  - [`vue-fe-review`](#vue-fe-review)
  - [`pre-pr-review`](#pre-pr-review)
- [工作顺序](#工作顺序)
- [安装](#安装)
- [使用 / 更新 / 卸载](#使用--更新--卸载)
- [添加新 Skill](#添加新-skill)

---

## Skills 详解

### `fe-project-init`

从零搭 **PC / 移动 H5** 项目骨架。

- **触发**：`/fe-project-init`、"新建 H5 项目"、"从零搭项目"、"起一个前端项目"
- **产出**：Vue3 + Vite / Nuxt3 / React / Next 骨架；多域名拦截器；Tailwind 设计纪律（双字族 + brand 十档色阶 + 渐变背景 + 4.5:1 对比度）；可选会员管理
- **流程**：10 问收集需求（技术栈 / 纯静态或有接口 / PC 是否自适应移动 / 会员等），答完自动执行到底，不再二次确认
- **附带**：关键文件写文件头中文注释（职责 / 依赖方 / 修改注意点），项目 `README.md` 写目录导读表；禁止"定义变量""导入路由"类废话注释

详见 [`fe-project-init/`](./fe-project-init)

### `mp-project-init`

从零搭 **微信小程序** 项目骨架（uni-app + Vue3 + Vite + TS）。

- **触发**：`/mp-project-init`、"新建小程序"、"起个微信小程序"、"搭小程序架子"
- **产出**：uni-app 骨架；tabBar + 登录页；`envVersion` 域名切换；rpx 适配；业务方向可选商城 / 新闻 / 视频
- **流程**：5 问收集需求（方向 / 样式 / 域名 / 会员等），答完自动执行到底
- **附带**：关键文件写文件头中文注释（职责 / 依赖方 / 修改注意点），项目 `README.md` 写目录导读表；`pages.json` 等 JSON 无法注释的内容统一写在 README；禁止"定义变量""导入路由"类废话注释

详见 [`mp-project-init/`](./mp-project-init)

### `req-analyze`

拿到需求后先做落点分析，**只读不改代码**。

- **触发**：`/req-analyze`、"分析这个需求"、"这个需求要改哪里"、"影响范围"、"改页面还是加功能"
- **产出**：判断"改页面 / 加功能 / 加组件"的类型；建议改动文件清单；关联组件影响；关联功能风险；实施顺序
- **纪律**：结论必须基于需求文本 + 当前项目代码证据，不脑补

详见 [`req-analyze/`](./req-analyze)

### `vue-component-gen`

生成 **Vue3 + TS + Nuxt** 组件 / 页面骨架。

- **触发**：`/vue-component-gen`、"生成组件"、"建一个 xxx 页面"、"写个 xxx 组件"、"搭个骨架"
- **产出**：组件 / 页面骨架；自动套用项目的 UI 库 / 状态库 / 请求封装
- **约定读取**：自动读 `config/design.ts`（端 / 单位）和 `config/env.ts`（域名）；移动端按 750 稿 rpx / rem 适配

详见 [`vue-component-gen/`](./vue-component-gen)

### `vue-fe-review`

Vue 代码专项 review，**只读不改**、**只做三件事**。

- **触发**：`/vue-fe-review`、"review 一下"、"看看这段代码"、"检查内存泄漏"、"看看加载速度"
- **关注**：
  - **代码错误** — 响应式陷阱 / SSR 反模式 / 路由 404 / 危险非空断言等运行时 bug
  - **加载速度** — 首屏包体积 / 请求瀑布 / 图片与字体 / 懒加载
  - **内存泄漏** — 未清理的监听器 / 定时器 / observer / 大列表 / 深响应式大对象
- **流程**：默认扫当前 `git diff`；一轮 + 自省一次后收口；分级 🔴 必改 / 🟡 建议改
- **不管**：安全深扫、测试覆盖（走 `pre-pr-review`）；类型完整性、设计纪律、命名风格、代码格式（都不管）

详见 [`vue-fe-review/`](./vue-fe-review)

### `pre-pr-review`

提 PR 前的安全 + 测试专项审查，**只读不改**。

- **触发**：`/pre-pr-review`、"提 PR 前审一下"、"安全审查"、"检查安全性"、"测试覆盖"
- **关注**：
  - **安全** — 注入 / XSS / 敏感信息泄漏 / 开放重定向 / 鉴权绕过 / SSR 私密配置泄漏 / 依赖风险
  - **测试** — 单测 / 组件测试 / e2e 缺口；手工验证清单；高风险改动的构建 / 类型 / lint 提示
- **流程**：默认审当前 `git diff`；分级 P0 阻断 / P1 必改 / P2 建议
- **不管**：Vue 代码错误、加载速度、内存泄漏（走 `vue-fe-review`）

详见 [`pre-pr-review/`](./pre-pr-review)

---

## 工作顺序

按 **起项目 → 分析需求 → 写代码 → 审查代码** 四阶段组织：

```mermaid
flowchart LR
  A["<b>1. 起项目</b><br/>fe-project-init<br/>mp-project-init"] -->
  B["<b>2. 分析需求</b><br/>req-analyze"] -->
  C["<b>3. 写代码</b><br/>vue-component-gen"] -->
  D["<b>4. 审查代码</b><br/>vue-fe-review<br/>pre-pr-review"]
```

| 阶段 | Skill | 输入 | 输出 |
|------|-------|------|------|
| 1. 起项目 | `fe-project-init` / `mp-project-init` | 空目录 + 问答 | 可跑的项目骨架 |
| 2. 分析需求 | `req-analyze` | 需求文本 + 现有代码 | 改动清单（不动代码） |
| 3. 写代码 | `vue-component-gen` | 阶段 2 的清单 | 组件 / 页面骨架 |
| 4. 审查代码 | `vue-fe-review` + `pre-pr-review` | `git diff` | 分级审查报告（不动代码） |

阶段 4 的两个 skill **职责不重叠**、**都跑一遍才能覆盖完整**：`vue-fe-review` 抓运行时错误和性能，`pre-pr-review` 抓安全和测试。两个 skill 在末尾都会提醒对方范围内的疑点。类型完整性、设计纪律、命名风格、代码格式、a11y 等**不在任一 review skill 范围**，靠项目 lint / typecheck 兜底。确认 review 结论后再让 agent「按 review 改」。

---

## 安装

### macOS / Linux

```bash
git clone https://github.com/<your-username>/claude-skills.git ~/claude-skills
cd ~/claude-skills
bash install.sh
```

### Windows (PowerShell)

```powershell
git clone https://github.com/<your-username>/claude-skills.git $HOME\claude-skills
cd $HOME\claude-skills
.\install.ps1
```

安装脚本把每个 skill **软链接**到下表两个目录（同时支持两个工具）：

| 工具 | 路径 |
|------|------|
| Claude Code | `~/.claude/skills/` |
| Cursor | `~/.cursor/skills/` |

已存在的同名目录会自动备份为 `xxx.backup-<时间戳>`。

**仅装其中一个工具**：

```bash
INSTALL_TARGETS="$HOME/.cursor/skills" bash install.sh   # 只装 Cursor
INSTALL_TARGETS="$HOME/.claude/skills" bash install.sh   # 只装 Claude Code
```

---

## 使用 / 更新 / 卸载

### 使用

- **斜杠命令**：`/fe-project-init` `/mp-project-init` `/req-analyze` `/vue-component-gen` `/vue-fe-review` `/pre-pr-review`
- **常用口令**：「新建 H5 项目」「新建小程序」「分析这个需求」「写个 xxx 组件」「review 一下」「提 PR 前审一下」
- **自然语言**：见每个 skill 详解里的"触发"

安装或更新后**新开 Agent 会话**再使用。

### 更新

```bash
cd ~/claude-skills
git pull           # 软链接自动指向新版本
bash install.sh    # 有新 skill 时补链
```

### 卸载

```bash
rm ~/.claude/skills/fe-project-init ~/.claude/skills/mp-project-init \
   ~/.claude/skills/req-analyze ~/.claude/skills/vue-component-gen \
   ~/.claude/skills/vue-fe-review ~/.claude/skills/pre-pr-review
rm ~/.cursor/skills/fe-project-init ~/.cursor/skills/mp-project-init \
   ~/.cursor/skills/req-analyze ~/.cursor/skills/vue-component-gen \
   ~/.cursor/skills/vue-fe-review ~/.cursor/skills/pre-pr-review
```

只删软链接，源文件仍在 `~/claude-skills/`。

---

## 添加新 Skill

1. 根目录建 `<skill-name>/SKILL.md`
2. 跑一次 `bash install.sh` 或 `.\install.ps1` 补软链
3. 在本 README「Skills 详解」下补一节，按类型选字段：
   - **起项目类**：触发 / 产出 / 流程 / 附带
   - **分析类**：触发 / 产出 / 纪律
   - **写代码类**：触发 / 产出 / 约定读取（或流程）
   - **审查类**：触发 / 关注 / 流程 / 不管（写明与另一 review skill 的边界）
4. 如果属于新阶段（不属于现有四个），在「工作顺序」的 mermaid 图和表格里也加一栏

---

## License

MIT
