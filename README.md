# claude-skills

个人 Agent Skills 仓库，面向 **Vue3 + TypeScript + Nuxt** 与 **uni-app 微信小程序** 的日常开发。同时支持 **Claude Code** 与 **Cursor**。

## 包含的 Skills

| Skill | 触发 | 作用 |
|-------|------|------|
| [`fe-project-init`](./fe-project-init) | `/fe-project-init`、新建 H5 项目 | PC/移动 H5 骨架；10 问(技术栈/纯静态或有接口/PC自适应等)；Tailwind 设计纪律；多域名拦截器；**骨架中文注释 + README 目录导读** |
| [`mp-project-init`](./mp-project-init) | `/mp-project-init`、新建小程序 | uni-app + Vue3 + Vite + TS；5 问(方向商城/新闻/视频/样式/域名/会员)；tabBar + 登录页 + envVersion 域名切换；**注释 + 目录导读** |
| [`vue-component-gen`](./vue-component-gen) | `/vue-component-gen`、生成组件/页面 | 匹配项目目录、UI 库、请求封装；自动读 `config/design.ts`、`config/env.ts` |
| [`vue-fe-review`](./vue-fe-review) | `/vue-fe-review`、review 代码 | 一轮 review；响应式/SSR/路由硬编码/加载速度；**只报告不改代码**；自省一次后收口 |
| [`pre-pr-review`](./pre-pr-review) | `/pre-pr-review`、提交 PR 前审查 | 检查安全性、性能瓶颈、类型定义完整性、测试覆盖和最佳实践；默认审当前 diff；**只读不改代码** |
| [`req-analyze`](./req-analyze) | `/req-analyze`、需求分析 | 判断需求是改页面/加功能/加组件；定位改动文件；分析关联组件与关联功能影响；**只读不改代码** |

### 推荐工作流

```
新建 H5     → fe-project-init
新建小程序   → mp-project-init
需求落点分析 → req-analyze（先判断改页面/加功能/加组件和影响范围）
写页面组件   → vue-component-gen（会读 fe/mp 项目里的 config）
提交前审查   → pre-pr-review（安全/性能/类型/最佳实践/测试）
合入前专项审查 → vue-fe-review（确认后再说「按 review 改」）
```

**分工**：`fe-project-init` 只管 H5；小程序统一走 `mp-project-init`，互不混用。

### 生成项目的协作约定

`fe-project-init` / `mp-project-init` 生成的骨架默认包含：

- 关键文件**文件头中文注释**（职责、依赖、修改注意点）
- `README.md` **目录导读表**（`pages.json` 等 JSON 无法注释的内容写在 README）
- 禁止「定义变量」类废话注释

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

安装脚本会把每个 skill **软链接**到：

| 工具 | 路径 |
|------|------|
| Claude Code | `~/.claude/skills/` |
| Cursor | `~/.cursor/skills/` |

已存在的同名目录会自动备份为 `xxx.backup-<时间戳>`。

**仅装 Cursor**：

```bash
INSTALL_TARGETS="$HOME/.cursor/skills" bash install.sh
```

**仅装 Claude Code**：

```bash
INSTALL_TARGETS="$HOME/.claude/skills" bash install.sh
```

## 更新

```bash
cd ~/claude-skills
git pull   # 软链接自动指向新版本
bash install.sh   # 有新 skill 时补链
```

## 使用

在 Claude Code 或 Cursor 中：

- 斜杠命令：`/fe-project-init` `/mp-project-init` `/vue-component-gen` `/vue-fe-review` `/pre-pr-review` `/req-analyze`
- 自然语言：「从零搭个 H5 项目」「新建小程序」「分析这个需求」「提交 PR 前审查」「review 一下这段代码」「建一个用户卡片组件」

安装或更新后**新开 Agent 会话**再使用。

## 卸载

```bash
rm ~/.claude/skills/fe-project-init ~/.claude/skills/mp-project-init
rm ~/.claude/skills/vue-component-gen ~/.claude/skills/vue-fe-review ~/.claude/skills/pre-pr-review ~/.claude/skills/req-analyze
rm ~/.cursor/skills/fe-project-init ~/.cursor/skills/mp-project-init
rm ~/.cursor/skills/vue-component-gen ~/.cursor/skills/vue-fe-review ~/.cursor/skills/pre-pr-review ~/.cursor/skills/req-analyze
```

只删软链接，源文件仍在 `~/claude-skills/`。

## 添加新 Skill

1. 根目录建 `<skill-name>/SKILL.md`
2. `bash install.sh` 或 `.\install.ps1`
3. 在本 README 表格补一行说明

## License

MIT
