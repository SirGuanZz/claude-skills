#!/usr/bin/env bash
# install.sh — 把当前仓库里的每个 skill 软链接到 Claude Code 与 Cursor
# 已存在的同名目录会备份为 xxx.backup-<timestamp>

set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"

# 可通过环境变量覆盖,例: INSTALL_TARGETS="$HOME/.cursor/skills" bash install.sh
if [[ -n "${INSTALL_TARGETS:-}" ]]; then
  # shellcheck disable=SC2206
  TARGETS=($INSTALL_TARGETS)
else
  TARGETS=("$HOME/.claude/skills" "$HOME/.cursor/skills")
fi

install_to_target() {
  local target_dir="$1"
  mkdir -p "$target_dir"

  echo "📦 安装 skills 到 $target_dir"
  echo "   源目录: $REPO_DIR"
  echo ""

  local installed=0 skipped=0 backed_up=0

  for skill_dir in "$REPO_DIR"/*/; do
    local skill_name
    skill_name="$(basename "$skill_dir")"

    if [[ "$skill_name" == .* || "$skill_name" == node_modules ]]; then
      continue
    fi

    if [[ ! -f "$skill_dir/SKILL.md" ]]; then
      echo "⏭️  跳过 $skill_name (没有 SKILL.md)"
      skipped=$((skipped + 1))
      continue
    fi

    local link_path="$target_dir/$skill_name"

    if [[ -L "$link_path" ]]; then
      local current_target
      current_target="$(readlink "$link_path")"
      if [[ "$current_target" == "$skill_dir"* || "$current_target" == "${skill_dir%/}" ]]; then
        echo "✅ $skill_name (已链接,跳过)"
        skipped=$((skipped + 1))
        continue
      fi
      local backup_path="${link_path}.backup-${TIMESTAMP}"
      mv "$link_path" "$backup_path"
      echo "📋 $skill_name (旧软链接已备份为 $(basename "$backup_path"))"
      backed_up=$((backed_up + 1))
    elif [[ -e "$link_path" ]]; then
      local backup_path="${link_path}.backup-${TIMESTAMP}"
      mv "$link_path" "$backup_path"
      echo "📋 $skill_name (旧目录已备份为 $(basename "$backup_path"))"
      backed_up=$((backed_up + 1))
    fi

    ln -s "${skill_dir%/}" "$link_path"
    echo "🔗 $skill_name → $skill_dir"
    installed=$((installed + 1))
  done

  echo ""
  echo "完成 [$target_dir]: 新装 $installed 个 / 跳过 $skipped 个 / 备份 $backed_up 个"
  echo ""
}

for target in "${TARGETS[@]}"; do
  install_to_target "$target"
done

echo "重启 Claude Code / Cursor 后即可使用。"
