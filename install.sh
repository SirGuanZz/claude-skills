#!/usr/bin/env bash
# install.sh — 把当前仓库里的每个 skill 软链接到 ~/.claude/skills/
# 已存在的同名目录会备份为 xxx.backup-<timestamp>

set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="$HOME/.claude/skills"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"

mkdir -p "$TARGET_DIR"

echo "📦 安装 skills 到 $TARGET_DIR"
echo "   源目录: $REPO_DIR"
echo ""

INSTALLED=0
SKIPPED=0
BACKED_UP=0

for skill_dir in "$REPO_DIR"/*/; do
  skill_name="$(basename "$skill_dir")"

  # 跳过 .git、node_modules 之类的非 skill 目录
  if [[ "$skill_name" == .* || "$skill_name" == "node_modules" ]]; then
    continue
  fi

  # 必须含 SKILL.md 才算一个 skill
  if [[ ! -f "$skill_dir/SKILL.md" ]]; then
    echo "⏭️  跳过 $skill_name (没有 SKILL.md)"
    SKIPPED=$((SKIPPED + 1))
    continue
  fi

  link_path="$TARGET_DIR/$skill_name"

  # 已是指向本仓库的软链接 → 跳过
  if [[ -L "$link_path" ]]; then
    current_target="$(readlink "$link_path")"
    if [[ "$current_target" == "$skill_dir"* || "$current_target" == "${skill_dir%/}" ]]; then
      echo "✅ $skill_name (已链接,跳过)"
      SKIPPED=$((SKIPPED + 1))
      continue
    fi
    # 是别的软链接 → 备份
    backup_path="${link_path}.backup-${TIMESTAMP}"
    mv "$link_path" "$backup_path"
    echo "📋 $skill_name (旧软链接已备份为 $(basename "$backup_path"))"
    BACKED_UP=$((BACKED_UP + 1))
  elif [[ -e "$link_path" ]]; then
    # 真实文件/目录 → 备份
    backup_path="${link_path}.backup-${TIMESTAMP}"
    mv "$link_path" "$backup_path"
    echo "📋 $skill_name (旧目录已备份为 $(basename "$backup_path"))"
    BACKED_UP=$((BACKED_UP + 1))
  fi

  ln -s "${skill_dir%/}" "$link_path"
  echo "🔗 $skill_name → $skill_dir"
  INSTALLED=$((INSTALLED + 1))
done

echo ""
echo "完成: 新装 $INSTALLED 个 / 跳过 $SKIPPED 个 / 备份 $BACKED_UP 个"
echo ""
echo "重启 Claude Code 后即可使用。"
