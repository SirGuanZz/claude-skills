# claude-skills

我的 Claude Code 个人技能集，主要面向 Vue3 + TypeScript + Nuxt 的前端日常开发。

## 包含的 Skills

| Skill | 作用 |
|-------|------|
| [`fe-project-init`](./fe-project-init) | 从零创建 H5 项目骨架(PC/移动/纯静态或有接口/PC自适应),答完 10 问自动跑到底 |
| [`mp-project-init`](./mp-project-init) | 用 uni-app 从零创建微信小程序骨架(Vue3+Vite+TS),多域名拦截器/登录页/tabBar,答完 4 问自动跑到底 |
| [`vue-component-gen`](./vue-component-gen) | 快速生成 Vue3 + TS + Nuxt 组件/页面骨架,自动匹配项目目录约定、UI 库、状态库、请求封装 |
| [`vue-fe-review`](./vue-fe-review) | Review Vue3 + TS + Nuxt 代码,专抓响应式陷阱、SSR 反模式、性能/内存问题 |

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

安装脚本会把每个 skill 软链接到 **Claude Code**（`~/.claude/skills/`）和 **Cursor**（`~/.cursor/skills/`）。已存在的同名目录会自动备份成 `xxx.backup-<时间戳>`。

## 更新

软链接的好处是更新无成本：

```bash
cd ~/claude-skills
git pull   # 拉最新内容,符号链接自动指向新版本
```

## 使用

在 Claude Code 里：

- 直接打 `/fe-project-init` / `/mp-project-init` / `/vue-component-gen` / `/vue-fe-review`
- 或用自然语言触发,如 "帮我建个用户卡片组件"、"review 一下这段代码"、"从零搭个 H5 项目"、"新建小程序"

Claude Code 与 Cursor 安装路径分别为 `~/.claude/skills/`、`~/.cursor/skills/`。仅装 Cursor 时可执行:

```bash
INSTALL_TARGETS="$HOME/.cursor/skills" bash install.sh
```

## 卸载

```bash
rm ~/.claude/skills/fe-project-init
rm ~/.claude/skills/mp-project-init
rm ~/.claude/skills/vue-component-gen
rm ~/.claude/skills/vue-fe-review
rm ~/.cursor/skills/fe-project-init
rm ~/.cursor/skills/mp-project-init
rm ~/.cursor/skills/vue-component-gen
rm ~/.cursor/skills/vue-fe-review
```

(只删软链接,源文件还在 `~/claude-skills/`)

## 添加新 Skill

1. 在仓库根目录建子目录 `<skill-name>/`
2. 写 `SKILL.md`(参考现有的格式)
3. 重新跑 `bash install.sh`
4. 提交并 push

## License

MIT
