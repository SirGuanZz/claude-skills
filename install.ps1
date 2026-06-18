# install.ps1 — 把当前仓库里的每个 skill 软链接到 Claude Code 与 Cursor
# 已存在的同名目录会备份为 xxx.backup-<timestamp>
# 注意:Windows 创建符号链接需要管理员权限或开启开发者模式

$ErrorActionPreference = "Stop"

$RepoDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"

# 可通过环境变量覆盖,例: $env:INSTALL_TARGETS = "$HOME\.cursor\skills"
if ($env:INSTALL_TARGETS) {
    $Targets = $env:INSTALL_TARGETS -split '\s+'
} else {
    $Targets = @(
        (Join-Path $HOME ".claude\skills"),
        (Join-Path $HOME ".cursor\skills")
    )
}

function Install-ToTarget {
    param([string]$TargetDir)

    if (-not (Test-Path $TargetDir)) {
        New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
    }

    Write-Host "📦 安装 skills 到 $TargetDir"
    Write-Host "   源目录: $RepoDir"
    Write-Host ""

    $Installed = 0
    $Skipped = 0
    $BackedUp = 0

    Get-ChildItem -Path $RepoDir -Directory | ForEach-Object {
        $SkillName = $_.Name
        $SkillDir = $_.FullName

        if ($SkillName.StartsWith(".") -or $SkillName -eq "node_modules") {
            return
        }

        if (-not (Test-Path (Join-Path $SkillDir "SKILL.md"))) {
            Write-Host "⏭️  跳过 $SkillName (没有 SKILL.md)"
            $script:Skipped++
            return
        }

        $LinkPath = Join-Path $TargetDir $SkillName

        if (Test-Path $LinkPath) {
            $Item = Get-Item $LinkPath -Force
            if ($Item.LinkType -eq "SymbolicLink" -and $Item.Target -eq $SkillDir) {
                Write-Host "✅ $SkillName (已链接,跳过)"
                $script:Skipped++
                return
            }
            $BackupPath = "$LinkPath.backup-$Timestamp"
            Move-Item -Path $LinkPath -Destination $BackupPath
            Write-Host "📋 $SkillName (旧目录已备份为 $(Split-Path $BackupPath -Leaf))"
            $script:BackedUp++
        }

        try {
            New-Item -ItemType SymbolicLink -Path $LinkPath -Target $SkillDir | Out-Null
            Write-Host "🔗 $SkillName → $SkillDir"
            $script:Installed++
        } catch {
            Write-Host "❌ $SkillName 创建软链接失败: $_" -ForegroundColor Red
            Write-Host "   提示: Windows 需要管理员权限或在「开发者模式」下运行" -ForegroundColor Yellow
        }
    }

    Write-Host ""
    Write-Host "完成 [$TargetDir]: 新装 $Installed 个 / 跳过 $Skipped 个 / 备份 $BackedUp 个"
    Write-Host ""
}

foreach ($target in $Targets) {
    Install-ToTarget $target
}

Write-Host "重启 Claude Code / Cursor 后即可使用。"
