#!/bin/bash
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

set -e

error_handler() {
    echo "❌ 部署失败: 第 $1 行发生错误"
    exit 1
}

trap 'error_handler ${LINENO}' ERR

echo "🚀 开始部署..."

echo "🧹 清空本地 dist 目录..."
rm -rf dist

echo "🏗️ 执行本地构建..."
pnpm run build

echo "📦 同步 dist 到远程服务器..."
rsync -az --delete ./dist/ root@117.50.197.116:/home/manage/

echo "✅ 部署完成！"